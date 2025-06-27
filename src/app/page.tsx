import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, GitCompareArrows } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const tools = [
    {
      href: "/summarize",
      icon: <FileText className="h-12 w-12 text-primary" />,
      title: "Summarize PDF",
      description: "Get a quick summary of any PDF document.",
    },
    {
      href: "/compare",
      icon: <GitCompareArrows className="h-12 w-12 text-primary" />,
      title: "Compare PDFs",
      description: "Compare two PDF documents to find the differences.",
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <section className="container mx-auto px-4 py-12 text-center md:px-6 md:py-16">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">
            The PDF Toolkit You Need
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl">
            All the tools to work with PDFs in one place. Simple, fast, and free.
          </p>
        </section>
        <section className="container mx-auto max-w-5xl px-4 pb-12 md:px-6 md:pb-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {tools.map((tool) => (
              <Link href={tool.href} key={tool.href} className="flex">
                <Card className="flex h-full w-full transform-gpu flex-col justify-between rounded-xl border-2 border-transparent bg-card shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-primary hover:shadow-2xl">
                  <CardHeader className="items-center pt-8 text-center">
                    {tool.icon}
                  </CardHeader>
                  <CardContent className="flex flex-grow flex-col items-center text-center">
                    <CardTitle className="text-2xl font-bold">{tool.title}</CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {tool.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        <footer className="py-8 text-center text-sm text-muted-foreground">
          Powered by GenAI
        </footer>
      </main>
    </div>
  );
}
