import Header from "@/components/header";
import PdfSummarizer from "@/components/pdf-summarizer";

export default function SummarizePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12">
        <div className="container flex max-w-2xl flex-col items-center justify-center px-4 md:px-6">
          <PdfSummarizer />
        </div>
      </main>
    </div>
  );
}
