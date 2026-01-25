import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/useCheckout";
import { Loader2 } from "lucide-react";
import { CalendarCheck, Shield, MapPin } from "lucide-react";
import UserProfileDropdown from "@/components/UserProfileDropdown";

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
    plan: "annual" as const,
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
    plan: "monthly" as const,
  },
];

const ChoosePlan = () => {
  const { startCheckout, loading } = useCheckout();

  // Auto-scroll to pricing section if hash is present
  useEffect(() => {
    if (window.location.hash === "#pricing") {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const pricingSection = document.getElementById("pricing-section");
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <header className="p-6 border-b border-border bg-background flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-sm">BP</span>
          </div>
          <span className="font-semibold text-lg text-foreground">Better Pick</span>
        </Link>
        <UserProfileDropdown />
      </header>

      <main className="flex-1">
        {/* Services Explanation Section */}
        <section className="section-padding bg-background">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Choose Your Plan
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get access to daily structured lottery picks and tools designed to help you play smarter.
              </p>
            </div>

            {/* Services Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="text-center">
                <CalendarCheck className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Daily Structured Picks</h3>
                <p className="text-sm text-muted-foreground">
                  Carefully generated number sets for all Massachusetts lottery games.
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Smart Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Avoids common patterns and helps reduce shared-jackpot risk.
                </p>
              </div>
              <div className="text-center">
                <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">MA Game Focus</h3>
                <p className="text-sm text-muted-foreground">
                  All picks follow official rules for Massachusetts-supported games.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section id="pricing-section" className="section-padding bg-muted">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
                Select Your Plan
              </h2>
              <p className="text-muted-foreground">
                Start with a 7-day free trial. Cancel anytime.
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {plans.map((plan) => (
                <div 
                  key={plan.name}
                  className={`${plan.featured ? "pricing-card-featured" : "pricing-card"} transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
                  onClick={() => startCheckout(plan.plan)}
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
                      startCheckout(plan.plan);
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      plan.cta
                    )}
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
      </main>
    </div>
  );
};

export default ChoosePlan;
