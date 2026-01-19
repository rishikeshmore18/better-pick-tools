import { AlertCircle } from "lucide-react";

const problems = [
  "Repeating birthday numbers and obvious patterns",
  "Using the same 'lucky numbers' without thinking",
  "Playing inconsistently with no structure or limits",
];

export function ProblemSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8 text-balance">
            Most people don't lose because of bad luck. They lose because they play randomly.
          </h2>

          {/* Problems List */}
          <div className="space-y-4 mb-8">
            {problems.map((problem, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 text-left bg-muted rounded-lg p-4"
              >
                <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{problem}</span>
              </div>
            ))}
          </div>

          {/* Microcopy */}
          <p className="disclaimer-text">
            Better Pick helps introduce structure. It does not change the randomness of lottery outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}
