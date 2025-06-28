import Header from "@/components/header";
import PdfSplitter from "@/components/pdf-splitter";
import AdBanner from "@/components/ad-banner";

export default function SplitPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center bg-muted/30 py-12">
        <div className="container flex max-w-2xl flex-col items-center justify-center px-4 md:px-6">
          <PdfSplitter />
        </div>
        <AdBanner data-ad-slot="1234567894" data-ad-format="auto" data-full-width-responsive="true" />
      </main>
    </div>
  );
}
