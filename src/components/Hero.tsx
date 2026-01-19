import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustBadges = [
  "Transparent logic",
  "Cancel anytime",
  "No winnings promised",
  "Massachusetts-focused",
];

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-narrow text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance animate-fade-in">
          Daily Structured Lottery Picks
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Built to help you play smarter — not predict wins.
        </p>

        {/* Supporting Text */}
        <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Better Pick gives you structured number sets and reminders designed to help you 
          avoid common selection mistakes and play consistently. We never sell tickets. 
          We never place bets. We only provide information.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button className="btn-primary text-base px-8 py-6 h-auto">
            Try 7 Days Free
          </Button>
          <Button 
            variant="outline" 
            className="btn-secondary text-base px-8 py-6 h-auto"
            onClick={() => scrollToSection("#how-it-works")}
          >
            See How It Works
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          {trustBadges.map((badge) => (
            <div key={badge} className="trust-badge">
              <Check className="w-4 h-4 text-success" />
              <span>{badge}</span>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="disclaimer-text max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.5s" }}>
          Lottery outcomes are random. This service does not predict lottery outcomes or guarantee winnings.
        </p>
      </div>
    </section>
  );
}
