import PdfSummarizer from "@/components/pdf-summarizer";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 md:px-8">
      <PdfSummarizer />
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        Powered by GenAI
      </footer>
    </main>
  );
}
