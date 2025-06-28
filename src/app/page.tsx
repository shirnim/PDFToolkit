import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, GitCompareArrows, Combine, Scissors, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AdBanner from "@/components/ad-banner";

export default function Home() {
  const isAiConfigured = !!process.env.GOOGLE_API_KEY;

  const tools = [
    {
      href: "/summarize",
      icon: <FileText className="h-10 w-10" />,
      title: "Summarize PDF",
      description: "Get a quick summary of any PDF document.",
      disabled: !isAiConfigured,
    },
    {
      href: "/compare",
      icon: <GitCompareArrows className="h-10 w-10" />,
      title: "Compare PDFs",
      description: "Compare two PDF documents to find the differences.",
      disabled: !isAiConfigured,
    },
    {
      href: "/merge",
      icon: <Combine className="h-10 w-10" />,
      title: "Merge PDF",
      description: "Combine multiple PDFs into a single document.",
      disabled: false,
    },
    {
      href: "/split",
      icon: <Scissors className="h-10 w-10" />,
      title: "Split PDF",
      description: "Extract pages from a PDF or split it into multiple files.",
      disabled: false,
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center sm:py-32 md:px-6">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            The Ultimate PDF Toolkit
          </h1>
          <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Everything you need to work with your PDFs. Simple, fast, and intuitive.
          </p>
          <AdBanner data-ad-slot="1234567895" data-ad-format="auto" data-full-width-responsive="true" />
        </section>
        <section className="bg-muted/30 py-12 md:py-24">
            <div className="container mx-auto max-w-5xl px-4 md:px-6">
              {!isAiConfigured && (
                <Alert variant="destructive" className="mb-8 bg-yellow-50 border-yellow-200 text-yellow-800 [&>svg]:text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:text-yellow-300 dark:[&>svg]:text-yellow-300">
                  <Info className="h-4 w-4" />
                  <AlertTitle>AI Features Disabled</AlertTitle>
                  <AlertDescription>
                    To enable the &quot;Summarize&quot; and &quot;Compare&quot; tools, please add your Google API key to the <code className="font-semibold">GOOGLE_API_KEY</code> variable in your <code className="font-semibold">.env</code> file.
                  </AlertDescription>
                </Alert>
              )}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
                    {tools.map((tool) => {
                      const CardComponent = (
                         <Card className={cn(
                          "flex w-full h-full flex-col justify-between rounded-xl border bg-card shadow-sm transition-all duration-300",
                          tool.disabled 
                              ? "cursor-not-allowed bg-muted/50 opacity-70" 
                              : "group-hover:-translate-y-1 group-hover:border-primary group-hover:shadow-lg"
                        )}>
                          <CardHeader className="items-center pt-8 text-center">
                              <div className={cn(
                                  "rounded-full bg-primary/10 p-4 text-primary transition-colors", 
                                  !tool.disabled && "group-hover:bg-primary group-hover:text-primary-foreground"
                              )}>
                                  {tool.icon}
                              </div>
                          </CardHeader>
                          <CardContent className="flex flex-grow flex-col items-center text-center">
                              <CardTitle className="text-2xl font-bold">{tool.title}</CardTitle>
                              <CardDescription className="mt-2 text-base">
                              {tool.description}
                              </CardDescription>
                          </CardContent>
                        </Card>
                      );
                      
                      if (tool.disabled) {
                        return (
                          <div key={tool.href} className="group flex">
                            {CardComponent}
                          </div>
                        );
                      }

                      return (
                        <Link href={tool.href} key={tool.href} className="group flex">
                           {CardComponent}
                        </Link>
                      );
                    })}
                </div>
                <AdBanner data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true" />
            </div>
        </section>
        <footer className="py-8 text-center text-sm text-muted-foreground">
          Powered by GenAI on Firebase
        </footer>
      </main>
    </div>
  );
}
