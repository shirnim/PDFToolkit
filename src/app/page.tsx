import Header from "@/components/header";
import PdfComparer from "@/components/pdf-comparer";
import PdfSummarizer from "@/components/pdf-summarizer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FileText, GitCompareArrows } from "lucide-react";


export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 items-start justify-center bg-muted/30 py-12">
        <div className="container flex max-w-4xl flex-col items-center justify-center px-4 md:px-6">
          <Tabs defaultValue="summarize" className="w-full">
            <TabsList className="grid h-12 w-full grid-cols-2">
              <TabsTrigger value="summarize" className="text-base">
                <FileText className="mr-2 h-5 w-5" />
                Summarize
              </TabsTrigger>
              <TabsTrigger value="compare" className="text-base">
                <GitCompareArrows className="mr-2 h-5 w-5" />
                Compare
              </TabsTrigger>
            </TabsList>
            <TabsContent value="summarize" className="pt-6">
              <PdfSummarizer />
            </TabsContent>
            <TabsContent value="compare" className="pt-6">
              <PdfComparer />
            </TabsContent>
          </Tabs>
          <footer className="mt-8 text-center text-sm text-muted-foreground">
            Powered by GenAI
          </footer>
        </div>
      </main>
    </div>
  );
}
