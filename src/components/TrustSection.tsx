const trustBlocks = [
  {
    title: "No hype marketing",
    text: "We don't use exaggerated claims or fake success stories.",
  },
  {
    title: "Clear boundaries",
    text: "We clearly state what the product does and does not do.",
  },
  {
    title: "Transparent disclaimers",
    text: "Lottery outcomes are random. Better Pick is informational only.",
  },
];

export function TrustSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-balance">
            Built for people who value structure over superstition.
          </h2>
        </div>

        {/* Trust Blocks */}
        <div className="grid md:grid-cols-3 gap-8">
          {trustBlocks.map((block) => (
            <div key={block.title} className="text-center">
              <h3 className="font-medium text-foreground mb-2">{block.title}</h3>
              <p className="text-sm text-muted-foreground">{block.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
