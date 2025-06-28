import Header from "@/components/header";
import PdfMerger from "@/components/pdf-merger";
import AdBanner from "@/components/ad-banner";

export default function MergePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center bg-muted/30 py-12">
        <div className="container flex max-w-4xl flex-col items-center justify-center px-4 md:px-6">
          <PdfMerger />
        </div>
        <AdBanner data-ad-slot="1234567893" data-ad-format="auto" data-full-width-responsive="true" />
      </main>
    </div>
  );
}
