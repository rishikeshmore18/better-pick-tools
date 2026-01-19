import { CalendarCheck, Shield, MapPin, Bell, Check, X } from "lucide-react";

const valueCards = [
  {
    title: "Daily structured number sets",
    text: "Carefully generated picks designed to avoid common number traps and duplication.",
    icon: CalendarCheck,
  },
  {
    title: "Shared-jackpot risk awareness",
    text: "Avoids heavily played patterns so you're less likely to share a prize if you win.",
    icon: Shield,
  },
  {
    title: "Massachusetts game focus",
    text: "All picks follow the official rules of MA-supported games.",
    icon: MapPin,
  },
  {
    title: "Optional reminders",
    text: "Stay consistent without overplaying. You control frequency.",
    icon: Bell,
  },
];

const whatItIs = [
  { text: "Informational software", positive: true },
  { text: "Structured number-selection guidance", positive: true },
  { text: "Not a ticket seller", positive: false },
  { text: "Not a betting or wagering service", positive: false },
  { text: "Not a prediction tool", positive: false },
];

export function ValueSection() {
  return (
    <section id="what-you-get" className="section-padding bg-muted">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            What you get with Better Pick
          </h2>
        </div>

        {/* Value Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {valueCards.map((card) => (
            <div key={card.title} className="value-card">
              <card.icon className="w-10 h-10 text-accent mb-4" />
              <h3 className="font-medium text-foreground mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.text}</p>
            </div>
          ))}
        </div>

        {/* Callout Box */}
        <div className="max-w-xl mx-auto">
          <div className="card-elevated p-6">
            <h3 className="font-medium text-foreground mb-4 text-center">
              What Better Pick is — and isn't
            </h3>
            <div className="space-y-3">
              {whatItIs.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {item.positive ? (
                    <Check className="w-5 h-5 text-success shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-destructive shrink-0" />
                  )}
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
