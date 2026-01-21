import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const Success = () => {
  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <header className="p-6">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-sm">BP</span>
          </div>
          <span className="font-semibold text-lg text-foreground">Better Pick</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="card-elevated p-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome to Better Pick!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your subscription is being activated. This usually takes just a few seconds.
            </p>

            <Button asChild className="btn-primary w-full">
              <Link to="/members">Go to Dashboard</Link>
            </Button>

            <p className="text-sm text-muted-foreground mt-4">
              If your dashboard shows you're not subscribed, please wait a moment and refresh.
            </p>
          </div>

          <p className="disclaimer-text mt-6">
            Lottery outcomes are random. Better Pick provides informational tools only. We do not sell tickets, place bets, or guarantee outcomes.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Success;
