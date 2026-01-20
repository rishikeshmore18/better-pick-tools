import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "How it works", anchor: "#how-it-works" },
  { label: "What you get", anchor: "#what-you-get" },
  { label: "Pricing", anchor: "#pricing" },
  { label: "FAQ", anchor: "#faq" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (anchor: string) => {
    const element = document.querySelector(anchor);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">BP</span>
            </div>
            <span className="font-semibold text-lg text-foreground">Better Pick</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.anchor)}
                className="link-nav text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="link-nav text-sm font-medium">
              Login
            </Link>
            <Button 
              className="btn-primary" 
              size="sm"
              onClick={() => window.open("https://buy.stripe.com/dRmaEQ9M2btv3E2bQ37wA00", "_blank")}
            >
              Try 7 Days Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.anchor)}
                  className="link-nav text-sm font-medium text-left py-2"
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/login"
                className="link-nav text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Button 
                className="btn-primary w-full mt-2"
                onClick={() => window.open("https://buy.stripe.com/dRmaEQ9M2btv3E2bQ37wA00", "_blank")}
              >
                Try 7 Days Free
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
