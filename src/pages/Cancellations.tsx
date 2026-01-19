import { PolicyLayout } from "@/components/PolicyLayout";

const Cancellations = () => {
  return (
    <PolicyLayout title="Cancellation Policy">
      <div className="space-y-6 text-muted-foreground">
        <p className="text-lg">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Cancel Anytime</h2>
          <p>
            You may cancel your Better Pick subscription at any time. There are no 
            cancellation fees or penalties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Access After Cancellation</h2>
          <p>
            When you cancel, your access to Better Pick continues until the end of your 
            current billing period. You will not be charged for the next billing cycle.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">How to Cancel</h2>
          <p>
            You can cancel your subscription through your account settings or by contacting 
            us at support@betterpick.app. Cancellation requests are processed immediately.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Reactivation</h2>
          <p>
            If you change your mind, you can reactivate your subscription at any time. 
            Your preferences and settings will be saved.
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
};

export default Cancellations;
