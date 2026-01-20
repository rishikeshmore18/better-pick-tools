import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Better Pick Annual",
    price: "$299",
    originalPrice: "$499",
    period: "/ year",
    subtext: "Less than $1 a day",
    highlightSubtext: true,
    features: [
      "Daily structured picks",
      "Weekly rotation notes",
      "All supported MA games",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    featured: true,
    badge: "Best value",
  },
  {
    name: "Monthly",
    price: "$39",
    originalPrice: "$49",
    period: "/ month",
    subtext: "Cancel anytime",
    highlightSubtext: false,
    features: [
      "Daily structured picks",
      "Weekly rotation notes",
      "All supported MA games",
    ],
    cta: "Start Monthly",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="section-padding bg-muted">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Pricing
          </h2>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`${plan.featured ? "pricing-card-featured" : "pricing-card"} transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
              onClick={() => window.open("https://buy.stripe.com/dRmaEQ9M2btv3E2bQ37wA00", "_blank")}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="font-semibold text-lg text-foreground mb-4">{plan.name}</h3>

              {/* Price */}
              <div className="mb-2">
                {plan.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through mr-2">{plan.originalPrice}</span>
                )}
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className={`text-sm mb-6 ${plan.highlightSubtext ? "bg-primary text-primary-foreground font-semibold px-3 py-1.5 rounded-full inline-block" : "text-muted-foreground"}`}>
                {plan.subtext}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-success shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button 
                className={plan.featured ? "btn-primary w-full" : "btn-secondary w-full"}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open("https://buy.stripe.com/dRmaEQ9M2btv3E2bQ37wA00", "_blank");
                }}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Fine Print */}
        <p className="text-center disclaimer-text mt-8">
          Cancel anytime. No winnings promised. No gimmicks.
        </p>
      </div>
    </section>
  );
}
