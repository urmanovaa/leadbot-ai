import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { ChatWidget } from "@/components/chat/chat-widget";

export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
