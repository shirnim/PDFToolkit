import PdfSummarizer from "@/components/pdf-summarizer";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <PdfSummarizer />
    </main>
  );
}
