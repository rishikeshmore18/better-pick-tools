import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface PolicyLayoutProps {
  title: string;
  children: ReactNode;
}

export function PolicyLayout({ title, children }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 section-padding bg-background">
        <div className="container-narrow">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            {title}
          </h1>
          <div className="prose prose-gray max-w-none">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
