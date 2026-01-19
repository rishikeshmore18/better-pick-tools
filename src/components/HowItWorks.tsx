const steps = [
  {
    number: "1",
    title: "Choose your game",
    text: "Select Massachusetts and the lottery game you play.",
  },
  {
    number: "2",
    title: "Get structured picks",
    text: "Receive daily number sets built using transparent selection rules.",
  },
  {
    number: "3",
    title: "Use them when you buy tickets",
    text: "Apply the picks wherever you normally purchase tickets.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-background">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            How it works
          </h2>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-12">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="flex items-start gap-6"
            >
              <div className="step-number shrink-0">
                {step.number}
              </div>
              <div className="pt-1">
                <h3 className="font-medium text-foreground mb-1">{step.title}</h3>
                <p className="text-muted-foreground">{step.text}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-5 top-12 w-px h-12 bg-border" />
              )}
            </div>
          ))}
        </div>

        {/* Legal Line */}
        <p className="text-center disclaimer-text">
          We never sell tickets. We never place bets. We only provide information.
        </p>
      </div>
    </section>
  );
}
