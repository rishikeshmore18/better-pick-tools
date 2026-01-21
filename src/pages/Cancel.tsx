import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const Cancel = () => {
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
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-muted-foreground" />
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">
              Checkout Canceled
            </h1>
            <p className="text-muted-foreground mb-6">
              No worries! Your checkout was canceled and you haven't been charged.
            </p>

            <Button asChild className="btn-primary w-full">
              <Link to="/#pricing">View Pricing</Link>
            </Button>

            <p className="text-sm text-muted-foreground mt-4">
              Have questions? <Link to="/contact" className="text-accent hover:underline">Contact us</Link>
            </p>
          </div>

          <p className="disclaimer-text mt-6">
            Better Pick provides informational tools only. We do not sell tickets or guarantee outcomes.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Cancel;
