"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { summarizePdf } from "@/ai/flows/summarize-pdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Copy, X, Loader2, Wand2 } from "lucide-react";

export default function PdfSummarizer() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
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
    
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setSummary(null);
  };

  const handleSummarize = async () => {
    if (!file) return;

    setIsLoading(true);
    setSummary(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const pdfDataUri = e.target?.result as string;
        try {
          const result = await summarizePdf({ pdfDataUri });
          setSummary(result.summary);
        } catch (aiError) {
          console.error("AI Summarization Error:", aiError);
          toast({
            title: "Summarization Failed",
            description: "The PDF might be invalid, empty, or password-protected.",
            variant: "destructive",
          });
          handleClear();
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        console.error("File Reader Error");
        toast({
          title: "File Read Error",
          description: "There was an error reading your file.",
          variant: "destructive",
        });
        setIsLoading(false);
        handleClear();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error setting up file reader:", error);
      toast({
        title: "An Unexpected Error Occurred",
        description: "Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      handleClear();
    }
  };

  const handleClear = () => {
    setFile(null);
    setSummary(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    toast({
      title: "Copied to Clipboard",
      description: "The summary has been copied successfully.",
    });
  };

  const triggerFileSelect = () => !isLoading && fileInputRef.current?.click();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const artificialEvent = { target: { files: e.dataTransfer.files } } as unknown as ChangeEvent<HTMLInputElement>;
      handleFileChange(artificialEvent);
      e.dataTransfer.clearData();
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">Summarize your PDF</CardTitle>
        <CardDescription className="text-md text-muted-foreground pt-1">
          Upload a document and our AI will provide a concise summary.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 md:px-6">
        <div 
          className="relative flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-border p-8 transition-all duration-300 hover:border-primary/50 hover:bg-accent"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
            id="pdf-upload"
            disabled={isLoading}
          />
          {!file ? (
            <div className="text-center cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-semibold text-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">PDF only, up to 5MB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center cursor-pointer">
              <FileText className="h-12 w-12 text-primary" />
              <p className="mt-4 font-medium text-foreground truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              <Button variant="link" size="sm" onClick={(e) => { e.stopPropagation(); handleClear(); }} className="text-destructive hover:text-destructive h-auto p-1 mt-2 z-10">
                <X className="mr-1 h-4 w-4" /> Remove File
              </Button>
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleSummarize} 
          disabled={!file || isLoading}
          className="w-full text-lg py-6"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Summarizing...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Summarize
            </>
          )}
        </Button>

        {(isLoading || summary) && (
          <div className="space-y-2 animate-in fade-in duration-500 pt-4">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Summary</h3>
                {summary && !isLoading && (
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                  </Button>
                )}
            </div>
            {isLoading && !summary ? (
                <Skeleton className="h-64 w-full rounded-md" />
            ) : (
                <Textarea
                  value={summary || ""}
                  readOnly
                  className="h-64 resize-none bg-secondary/50 focus-visible:ring-primary/50"
                  aria-label="PDF Summary"
                />
            )}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
