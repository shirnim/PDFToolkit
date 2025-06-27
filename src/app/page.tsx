import Header from "@/components/header";
import PdfSummarizer from "@/components/pdf-summarizer";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12">
        <div className="container flex flex-col items-center justify-center px-4 md:px-6">
          <PdfSummarizer />
          <footer className="mt-8 text-center text-sm text-muted-foreground">
            Powered by GenAI
          </footer>
        </div>
      </main>
    </div>
  );
}
