import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/content/services";

const FAQ = () => {
  return (
    <section className="section-padding bg-black/40" aria-labelledby="faq-heading">
      <div className="container px-6 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="faq-heading" className="text-4xl font-bold mb-4">Common Questions</h2>
            <p className="text-muted-foreground">Information about the service and how I work.</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-white/5 bg-white/5 rounded-2xl px-6">
                <AccordionTrigger className="text-left font-bold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent forceMount className="text-muted-foreground font-light pb-6 leading-relaxed [[data-state=closed]>&]:hidden">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;