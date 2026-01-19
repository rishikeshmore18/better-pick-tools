import { Circle } from "lucide-react";

const games = [
  { name: "Powerball", subtitle: "Pick 5 + Powerball" },
  { name: "Mega Millions", subtitle: "Pick 5 + Mega Ball" },
  { name: "Lucky for Life", subtitle: "Pick 5 + Lucky Ball" },
  { name: "Mass Cash", subtitle: "Pick 5 numbers" },
  { name: "Megabucks", subtitle: "Pick 6 numbers" },
  { name: "Keno", subtitle: "Pick 1–12 spots" },
];

export function GamesStrip() {
  return (
    <section className="section-padding bg-muted">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Supported Massachusetts Games
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Better Pick provides informational number-selection tools for popular MA games. 
            Not affiliated with MA Lottery.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {games.map((game) => (
            <div key={game.name} className="game-card text-center">
              {/* Icon placeholder - simple balls representation */}
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(Math.min(5, game.name.length % 4 + 3))].map((_, i) => (
                  <Circle 
                    key={i} 
                    className="w-4 h-4 text-accent" 
                    fill="currentColor" 
                    strokeWidth={0}
                  />
                ))}
              </div>
              <h3 className="font-medium text-foreground text-sm mb-1">{game.name}</h3>
              <p className="text-xs text-muted-foreground">{game.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
