"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { summarizePdf } from "@/ai/flows/summarize-pdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Copy, X, Loader2 } from "lucide-react";

export default function PdfSummarizer() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid File Type",
        description: "Please upload a valid PDF file.",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    setSummary(null);
    setIsLoading(true);

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
            description: "Could not summarize the PDF. The file might be corrupted, empty, or password-protected.",
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
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      handleClear();
    }
  };

  const handleClear = () => {
    setFileName(null);
    setSummary(null);
    setIsLoading(false);
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

  const triggerFileSelect = () => !isLoading && !fileName && fileInputRef.current?.click();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading || fileName) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const artificialEvent = { target: { files: e.dataTransfer.files } } as unknown as ChangeEvent<HTMLInputElement>;
      handleFileChange(artificialEvent);
      e.dataTransfer.clearData();
    }
  };


  return (
    <Card className="w-full max-w-2xl shadow-xl rounded-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">PDF Summarizer</CardTitle>
        <CardDescription className="text-md text-muted-foreground">
          Upload a PDF and let AI provide a concise summary in seconds.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-4 md:px-6">
        <div 
          className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-border p-8 transition-all duration-300 hover:border-primary/80 hover:bg-accent data-[loading=true]:cursor-wait data-[has-file=true]:cursor-default"
          onClick={triggerFileSelect}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          data-loading={isLoading}
          data-has-file={!!fileName}
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
          {isLoading ? (
            <div className="flex flex-col items-center space-y-2 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="font-medium text-foreground">Summarizing...</p>
                <p className="text-sm text-muted-foreground truncate max-w-xs">{fileName}</p>
            </div>
          ) : fileName ? (
             <div className="flex flex-col items-center space-y-2 text-center">
                <p className="font-medium text-foreground truncate max-w-xs">{fileName}</p>
                <p className="text-sm text-muted-foreground">File uploaded successfully.</p>
                <Button variant="link" size="sm" onClick={(e) => { e.stopPropagation(); handleClear(); }} className="text-destructive hover:text-destructive h-auto p-1 z-10">
                    <X className="mr-1 h-4 w-4" /> Clear File
                </Button>
            </div>
          ) : (
            <div className="text-center cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 font-semibold text-primary">Click to upload or drag & drop</p>
              <p className="text-xs text-muted-foreground">PDF only, max 5MB</p>
            </div>
          )}
        </div>
        
        {summary && (
          <div className="space-y-2 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Summary</h3>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                </Button>
            </div>
            <Textarea
              value={summary}
              readOnly
              className="h-64 resize-none bg-secondary/50 focus-visible:ring-primary/50"
              aria-label="PDF Summary"
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
          <p className="text-xs text-muted-foreground w-full text-center">Powered by GenAI</p>
      </CardFooter>
    </Card>
  );
}
