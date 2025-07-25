'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Upload,
  FileText,
  X,
  Loader2,
  Combine,
  Download,
  Trash2,
} from 'lucide-react';
import { mergePdfs } from '@/actions/merge-pdf-action';

export default function PdfMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mergedPdfUri, setMergedPdfUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB server limit

    const currentTotalSize = files.reduce((acc, file) => acc + file.size, 0);
    const allowedNewFiles: File[] = [];
    let newFilesSize = 0;

    for (const file of selectedFiles) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid File Type',
          description: `${file.name} is not a valid PDF file.`,
          variant: 'destructive',
        });
        continue;
      }
      
      if (currentTotalSize + newFilesSize + file.size > MAX_TOTAL_SIZE) {
        toast({
          title: 'Total Size Limit Exceeded',
          description: `Adding more files would exceed the 25MB total upload limit. Not all files were added.`,
          variant: 'destructive',
        });
        break; 
      }
      
      allowedNewFiles.push(file);
      newFilesSize += file.size;
    }
    
    if (allowedNewFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...allowedNewFiles]);
      setMergedPdfUri(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setMergedPdfUri(null);
  };

  const handleClearAll = () => {
    setFiles([]);
    setMergedPdfUri(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: 'Not Enough Files',
        description: 'Please upload at least two PDF files to merge.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setMergedPdfUri(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const resultDataUri = await mergePdfs(formData);
      
      setMergedPdfUri(resultDataUri);
      toast({
        title: 'Merge Successful',
        description: 'Your PDFs have been merged.',
      });
    } catch (error: any) {
      toast({
        title: 'Merge Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileSelect = () => !isLoading && fileInputRef.current?.click();

  return (
    <Card className="w-full rounded-xl shadow-xl">
      <CardHeader className="items-center space-y-4 text-center">
        <div className="rounded-full bg-primary/10 p-4 text-primary">
          <Combine className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Merge PDF Files
          </CardTitle>
          <CardDescription className="pt-1 text-md text-muted-foreground">
            Combine multiple PDFs into one unified document.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-4 md:px-6">
        <div
          className="relative flex flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-muted bg-accent/50 p-8 text-center transition-all duration-300 hover:border-primary/60 hover:bg-accent"
          onClick={triggerFileSelect}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
            multiple
            disabled={isLoading}
          />
          <div className="cursor-pointer space-y-2 text-muted-foreground">
            <Upload className="mx-auto h-12 w-12" />
            <p className="mt-4 font-semibold text-foreground">
              Click to upload or <span className="text-primary">drag and drop</span>
            </p>
            <p className="text-sm">PDFs only, up to 25MB total</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Files to Merge ({files.length})</h3>
                <Button variant="ghost" size="sm" onClick={handleClearAll} disabled={isLoading}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All
                </Button>
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border bg-background p-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between gap-4 rounded-md bg-muted/50 p-2 text-sm">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="h-5 w-5 shrink-0 text-primary" />
                    <span className="truncate font-medium">{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemoveFile(index)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleMerge}
          disabled={files.length < 2 || isLoading}
          className="w-full py-6 text-lg"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Merging...
            </>
          ) : (
            <>
              <Combine className="mr-2 h-5 w-5" />
              Merge PDFs
            </>
          )}
        </Button>
        {mergedPdfUri && (
          <Button
            asChild
            className="w-full py-6 text-lg"
            size="lg"
            variant="outline"
          >
            <a href={mergedPdfUri} download="merged.pdf">
              <Download className="mr-2 h-5 w-5" />
              Download Merged PDF
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
