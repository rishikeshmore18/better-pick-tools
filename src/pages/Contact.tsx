import { Mail } from "lucide-react";
import { PolicyLayout } from "@/components/PolicyLayout";

const Contact = () => {
  return (
    <PolicyLayout title="Contact">
      <div className="space-y-8 text-muted-foreground">
        <section className="space-y-4">
          <p className="text-lg">
            Have questions about Better Pick? We're here to help.
          </p>
        </section>

        <section className="card-elevated p-8 max-w-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Email Support</h2>
              <a 
                href="mailto:info@ninetynineweb.com" 
                className="text-accent hover:underline font-medium"
              >
                info@ninetynineweb.com
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                We respond within 2 business days.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Common Topics</h2>
          <ul className="space-y-2">
            <li>• Account and billing questions</li>
            <li>• Subscription management</li>
            <li>• Technical support</li>
            <li>• Feedback and suggestions</li>
          </ul>
        </section>
      </div>
    </PolicyLayout>
  );
};

export default Contact;
