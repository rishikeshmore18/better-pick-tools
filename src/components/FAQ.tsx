import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Does Better Pick predict lottery numbers?",
    answer: "No. Lottery outcomes are random and cannot be predicted. Better Pick provides structured number sets designed to help you avoid common selection patterns. We do not claim to predict results or increase your chances of winning.",
  },
  {
    question: "How is this different from Quick Pick?",
    answer: "Quick Pick generates purely random numbers. Better Pick uses transparent selection rules to avoid commonly played patterns (like birthdays or sequences), which may reduce the likelihood of sharing a jackpot if you win. The outcome is still random.",
  },
  {
    question: "Do you sell lottery tickets?",
    answer: "No. Better Pick is informational software only. We do not sell tickets, place bets, or handle any transactions with lottery operators. You purchase tickets independently.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. You can cancel your subscription at any time. Your access continues until the end of your current billing period.",
  },
  {
    question: "Is Better Pick affiliated with the Massachusetts State Lottery?",
    answer: "No. Better Pick is not affiliated with, endorsed by, or connected to the Massachusetts State Lottery or any lottery operator.",
  },
  {
    question: "What games do you support?",
    answer: "We currently provide structured picks for Powerball, Mega Millions, Lucky for Life, Mass Cash, Megabucks, and Keno for Massachusetts players.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="section-padding bg-muted">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="card-elevated px-6 border-none"
              >
                <AccordionTrigger className="faq-trigger py-4 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
