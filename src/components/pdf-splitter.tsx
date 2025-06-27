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
  Scissors,
  FileArchive,
} from 'lucide-react';
import { splitPdfAction } from '@/actions/split-pdf-action';

export default function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [splitPdfZipUri, setSplitPdfZipUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a valid PDF file.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please upload a file smaller than 25MB.',
        variant: 'destructive',
      });
      return;
    }

    setFile(selectedFile);
    setSplitPdfZipUri(null);
  };

  const handleClear = () => {
    setFile(null);
    setSplitPdfZipUri(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSplit = async () => {
    if (!file) return;

    setIsLoading(true);
    setSplitPdfZipUri(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await splitPdfAction(formData);

      if (result.error) {
        toast({
          title: 'Split Failed',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result.data) {
        setSplitPdfZipUri(result.data);
        toast({
          title: 'Split Successful',
          description: 'Your PDF has been split into individual pages.',
        });
      }
    } catch (e: any) {
      console.error(e);
      toast({
        title: 'Split Failed',
        description:
          e.message || 'An unexpected error occurred while splitting the PDF.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileSelect = () => !isLoading && fileInputRef.current?.click();

  return (
    <Card className="w-full max-w-2xl rounded-xl shadow-xl">
      <CardHeader className="items-center space-y-4 text-center">
        <div className="rounded-full bg-primary/10 p-4 text-primary">
          <Scissors className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Split PDF
          </CardTitle>
          <CardDescription className="pt-1 text-md text-muted-foreground">
            Extract every page of your PDF into separate files.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-4 md:px-6">
        <div
          className="relative flex flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-muted bg-accent/50 p-8 transition-all duration-300 hover:border-primary/60 hover:bg-accent"
          onClick={triggerFileSelect}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
            disabled={isLoading}
          />
          {!file ? (
            <div className="cursor-pointer space-y-2 text-center text-muted-foreground">
              <Upload className="mx-auto h-12 w-12" />
              <p className="mt-4 font-semibold text-foreground">
                Click to upload or{' '}
                <span className="text-primary">drag and drop</span>
              </p>
              <p className="text-sm">PDF only, up to 25MB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <FileText className="h-12 w-12 text-primary" />
              <p className="mt-4 max-w-xs truncate font-medium text-foreground">
                {file.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="z-10 mt-2 h-auto p-1 text-destructive hover:text-destructive"
              >
                <X className="mr-1 h-4 w-4" /> Remove File
              </Button>
            </div>
          )}
        </div>

        <Button
          onClick={handleSplit}
          disabled={!file || isLoading}
          className="w-full py-6 text-lg"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Splitting...
            </>
          ) : (
            <>
              <Scissors className="mr-2 h-5 w-5" />
              Split PDF
            </>
          )}
        </Button>
        {splitPdfZipUri && !isLoading && (
          <Button
            asChild
            className="w-full py-6 text-lg"
            size="lg"
            variant="outline"
          >
            <a href={splitPdfZipUri} download="split_pages.zip">
              <FileArchive className="mr-2 h-5 w-5" />
              Download ZIP
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
