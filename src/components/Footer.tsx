import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Terms of Service", url: "/terms" },
  { label: "Privacy Policy", url: "/privacy" },
  { label: "Refund Policy", url: "/refunds" },
  { label: "Cancellation Policy", url: "/cancellations" },
  { label: "Disclaimer", url: "/disclaimer" },
  { label: "Contact", url: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container-wide py-12">
        {/* Logo and Disclaimer */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">BP</span>
              </div>
              <span className="font-semibold text-lg text-foreground">Better Pick</span>
            </div>
            <p className="disclaimer-text">
              Lottery outcomes are random. Better Pick provides informational tools only. 
              Not affiliated with the Massachusetts State Lottery or any lottery operator.
            </p>
          </div>

          {/* Links Grid */}
          <nav className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.url}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Better Pick. All rights reserved. 
            This service does not predict lottery outcomes or guarantee winnings.
          </p>
        </div>
      </div>
    </footer>
  );
}
