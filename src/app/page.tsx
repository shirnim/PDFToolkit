import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, GitCompareArrows, Combine, Scissors } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const tools = [
    {
      href: "/summarize",
      icon: <FileText className="h-10 w-10" />,
      title: "Summarize PDF",
      description: "Get a quick summary of any PDF document.",
    },
    {
      href: "/compare",
      icon: <GitCompareArrows className="h-10 w-10" />,
      title: "Compare PDFs",
      description: "Compare two PDF documents to find the differences.",
    },
    {
      href: "/merge",
      icon: <Combine className="h-10 w-10" />,
      title: "Merge PDF",
      description: "Combine multiple PDFs into a single document.",
    },
    {
      href: "/split",
      icon: <Scissors className="h-10 w-10" />,
      title: "Split PDF",
      description: "Extract pages from a PDF or split it into multiple files.",
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
        </section>
        <section className="bg-muted/30 py-12 md:py-24">
            <div className="container mx-auto max-w-5xl px-4 md:px-6">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
                    {tools.map((tool) => (
                    <Link href={tool.href} key={tool.href} className="group flex">
                        <Card className="flex w-full flex-col justify-between rounded-xl border bg-card shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary group-hover:shadow-lg">
                        <CardHeader className="items-center pt-8 text-center">
                            <div className="rounded-full bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
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
                    </Link>
                    ))}
                </div>
            </div>
        </section>
        <footer className="py-8 text-center text-sm text-muted-foreground">
          Powered by GenAI on Firebase
        </footer>
      </main>
    </div>
  );
}
