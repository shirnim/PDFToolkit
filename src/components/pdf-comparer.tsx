"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { comparePdfs } from "@/actions/compare-pdfs-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Copy, X, Loader2, GitCompareArrows } from "lucide-react";

function FileUploader({
  file,
  onFileChange,
  onClear,
  isLoading,
  id,
  title,
}: {
  file: File | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  isLoading: boolean;
  id: string;
  title: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelect = () => !isLoading && fileInputRef.current?.click();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const artificialEvent = { target: { files: e.dataTransfer.files } } as unknown as ChangeEvent<HTMLInputElement>;
      onFileChange(artificialEvent);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div
      className="relative flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-xl border-2 border-dashed border-muted bg-accent/50 p-6 transition-all duration-300 hover:border-primary/60 hover:bg-accent"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={triggerFileSelect}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="application/pdf"
        className="hidden"
        id={id}
        disabled={isLoading}
      />
      <h4 className="font-semibold text-foreground">{title}</h4>
      {!file ? (
        <div className="text-center text-muted-foreground">
          <Upload className="mx-auto h-10 w-10" />
          <p className="mt-2 text-sm font-semibold text-foreground">Click or drag & drop</p>
          <p className="text-xs mt-1">PDF up to 10MB</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <FileText className="h-10 w-10 text-primary" />
          <p className="mt-2 max-w-xs truncate text-sm font-medium text-foreground">{file.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onClear(); }} className="z-10 mt-1 h-auto p-1 text-destructive hover:text-destructive">
            <X className="mr-1 h-3 w-3" /> Remove
          </Button>
        </div>
      )}
    </div>
  );
}


export default function PdfComparer() {
  const [comparison, setComparison] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (fileNumber: 1 | 2) => (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast({
        title: "Invalid File Type",
        description: "Please upload a valid PDF file.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    if (fileNumber === 1) setFile1(selectedFile);
    if (fileNumber === 2) setFile2(selectedFile);
    setComparison(null);
  };
  
  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target?.result as string);
        };
        reader.onerror = () => {
            reject(new Error("File read error"));
        };
        reader.readAsDataURL(file);
    });
  }

  const handleCompare = async () => {
    if (!file1 || !file2) return;

    setIsLoading(true);
    setComparison(null);

    try {
      const [pdfDataUri1, pdfDataUri2] = await Promise.all([
        fileToDataUri(file1),
        fileToDataUri(file2)
      ]);
      
      const result = await comparePdfs({ pdfDataUri1, pdfDataUri2 });
      setComparison(result.comparison);

    } catch (error: any) {
      console.error("Comparison Error:", error);
      toast({
        title: "Comparison Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      handleClearAll();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = (fileNumber: 1 | 2) => () => {
    if (fileNumber === 1) setFile1(null);
    if (fileNumber === 2) setFile2(null);
    setComparison(null);
  };

  const handleClearAll = () => {
      setFile1(null);
      setFile2(null);
      setComparison(null);
  }

  const handleCopy = () => {
    if (!comparison) return;
    navigator.clipboard.writeText(comparison);
    toast({
      title: "Copied to Clipboard",
      description: "The comparison has been copied successfully.",
    });
  };

  return (
    <Card className="w-full rounded-xl shadow-xl">
      <CardHeader className="items-center space-y-4 text-center">
        <div className="rounded-full bg-primary/10 p-4 text-primary">
            <GitCompareArrows className="h-8 w-8" />
        </div>
        <div className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight">Compare Two PDFs</CardTitle>
            <CardDescription className="pt-1 text-md text-muted-foreground">
            Upload two documents and our AI will highlight the differences.
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 md:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FileUploader
            file={file1}
            onFileChange={handleFileChange(1)}
            onClear={handleClear(1)}
            isLoading={isLoading}
            id="pdf-upload-1"
            title="Document 1"
          />
          <FileUploader
            file={file2}
            onFileChange={handleFileChange(2)}
            onClear={handleClear(2)}
            isLoading={isLoading}
            id="pdf-upload-2"
            title="Document 2"
          />
        </div>
        
        <Button 
          onClick={handleCompare} 
          disabled={!file1 || !file2 || isLoading}
          className="w-full py-6 text-lg"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Comparing...
            </>
          ) : (
            <>
              <GitCompareArrows className="mr-2 h-5 w-5" />
              Compare
            </>
          )}
        </Button>

        {(isLoading || comparison) && (
          <div className="animate-in fade-in space-y-2 pt-4 duration-500">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Comparison Result</h3>
                {comparison && !isLoading && (
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                  </Button>
                )}
            </div>
            {isLoading && !comparison ? (
                <Skeleton className="h-64 w-full rounded-md" />
            ) : (
                <Textarea
                  value={comparison || ""}
                  readOnly
                  className="h-64 resize-none rounded-md border border-border bg-muted/30 focus-visible:ring-primary/50"
                  aria-label="PDF Comparison Result"
                />
            )}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
