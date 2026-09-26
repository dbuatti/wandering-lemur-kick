import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Authority from "@/components/Authority";
import Audience from "@/components/Audience";
import SecurityConcrete from "@/components/SecurityConcrete";
import CommonJobs from "@/components/CommonJobs";
import DigitalCleanSweep from "@/components/DigitalCleanSweep";
import Process from "@/components/Process";
import ServiceTiers from "@/components/ServiceTiers";
import FounderStatement from "@/components/FounderStatement";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { lazy, Suspense } from "react";
import { Mail, Phone } from "lucide-react";
import { useNearViewport } from "@/hooks/use-near-viewport";
import { site, telHref } from "@/content/site";

// The form pulls in zod, react-hook-form and the Supabase call; load it after first paint
const EnquiryForm = lazy(() => import("@/components/EnquiryForm"));

const Index = () => {
  const contact = useNearViewport<HTMLElement>();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Authority />

        <div id="who" className="scroll-mt-20">
          <Audience />
        </div>

        <div id="security" className="scroll-mt-20">
          <SecurityConcrete />
        </div>

        <div id="services" className="scroll-mt-20">
          <CommonJobs />
        </div>

        <div id="clean-sweep" className="scroll-mt-20">
          <DigitalCleanSweep />
        </div>

        <Process />

        <div id="tiers" className="scroll-mt-20">
          <ServiceTiers />
        </div>

        <div id="about" className="scroll-mt-20">
          <FounderStatement />
        </div>

        <div id="faq" className="scroll-mt-20">
          <FAQ />
        </div>

        <section id="contact" ref={contact.ref} className="section-padding bg-black/50 scroll-mt-20" aria-labelledby="contact-heading">
          <div className="container px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 id="contact-heading" className="text-4xl lg:text-6xl font-bold mb-6">Start a <span className="text-primary">Conversation.</span></h2>
                <p className="text-xl text-muted-foreground font-light">
                  I typically respond to new enquiries within 24 hours.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-10 text-sm">
                  <a href={`mailto:${site.email}`} className="inline-flex items-center justify-center gap-2 text-white/80 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4 text-primary" aria-hidden="true" /> {site.email}
                  </a>
                  {site.phone && (
                    <a href={telHref(site.phone)} className="inline-flex items-center justify-center gap-2 text-white/80 hover:text-primary transition-colors">
                      <Phone className="h-4 w-4 text-primary" aria-hidden="true" /> {site.phone}
                    </a>
                  )}
                </div>
              </div>
              <div className="bg-white/5 p-8 lg:p-12 rounded-[3rem] border border-white/10 shadow-2xl">
                {contact.isNear ? (
                  <Suspense fallback={<div className="min-h-[480px]" aria-hidden="true" />}>
                    <EnquiryForm />
                  </Suspense>
                ) : (
                  <div className="min-h-[480px]" aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
