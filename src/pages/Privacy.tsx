import { PolicyLayout } from "@/components/PolicyLayout";

const Privacy = () => {
  return (
    <PolicyLayout title="Privacy Policy">
      <div className="space-y-6 text-muted-foreground">
        <p className="text-lg">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
          <p>
            We collect basic account information (email address) and usage data to operate 
            the service. This includes your game preferences and reminder settings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Payment Processing</h2>
          <p>
            Payments are processed securely by a third-party payment provider. We do not 
            store your full credit card information on our servers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Data Usage</h2>
          <p>
            We use your data to provide the Better Pick service, send you your selected picks 
            and reminders, and improve our product.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Data Sharing</h2>
          <p>
            We do not sell personal data to third parties. We may share data with service 
            providers who help us operate our service (e.g., email delivery, payment processing).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data by 
            contacting us at support@betterpick.app
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p>
            For privacy-related questions, please contact us at support@betterpick.app
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
};

export default Privacy;
