import Header from "@/components/header";
import PdfComparer from "@/components/pdf-comparer";

export default function ComparePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12">
        <div className="container flex max-w-4xl flex-col items-center justify-center px-4 md:px-6">
          <PdfComparer />
        </div>
      </main>
    </div>
  );
}
