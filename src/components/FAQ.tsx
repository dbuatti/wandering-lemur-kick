import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Do you provide on-site support in Melbourne?",
      answer: "Yes, I provide on-site support across Melbourne, particularly in the inner suburbs and Bayside areas. I also offer secure remote support for other locations."
    },
    {
      question: "Do you work with Windows or just Apple?",
      answer: "While I am an Apple Specialist, I often manage mixed environments. I can help ensure Windows-based tools work correctly within your Apple ecosystem."
    },
    {
      question: "How do you handle sensitive data and privacy?",
      answer: "Privacy is a priority. I use professional encryption, do not store your passwords, and can perform privacy audits to ensure your data is secure."
    },
    {
      question: "Is there a minimum booking time?",
      answer: "For on-site visits, there is a 1-hour minimum. Remote support can be booked in 30-minute increments."
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container px-6 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Common Questions</h2>
            <p className="text-muted-foreground">Information about the service and how I work.</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-white/5 bg-white/5 rounded-2xl px-6">
                <AccordionTrigger className="text-left font-bold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light pb-6 leading-relaxed">
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