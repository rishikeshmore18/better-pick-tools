import { PolicyLayout } from "@/components/PolicyLayout";

const Refunds = () => {
  return (
    <PolicyLayout title="Refund Policy">
      <div className="space-y-6 text-muted-foreground">
        <p className="text-lg">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">First-Time Subscribers</h2>
          <p>
            First-time subscribers may request a full refund within 7 days of initial payment 
            if there has been no substantial usage of the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Renewals</h2>
          <p>
            Subscription renewals are non-refundable. We recommend cancelling before your 
            renewal date if you do not wish to continue the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">How to Request a Refund</h2>
          <p>
            To request a refund, please contact us at support@betterpick.app with your 
            account email and the reason for your request. We will respond within 2 business days.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Processing Time</h2>
          <p>
            Approved refunds are processed within 5-10 business days. The refund will be 
            credited to the original payment method.
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
};

export default Refunds;
