import { PolicyLayout } from "@/components/PolicyLayout";

const Terms = () => {
  return (
    <PolicyLayout title="Terms of Service">
      <div className="space-y-6 text-muted-foreground">
        <p className="text-lg">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">1. Service Description</h2>
          <p>
            Better Pick provides informational number-selection tools only. We do not guarantee 
            results, sell tickets, or place bets. Use of the service is at your own discretion.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">2. No Warranties</h2>
          <p>
            Lottery outcomes are determined by chance and cannot be predicted. Better Pick makes 
            no representations or warranties regarding the likelihood of winning any lottery game.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">3. User Responsibilities</h2>
          <p>
            You are solely responsible for your decision to purchase lottery tickets and for 
            complying with all applicable laws in your jurisdiction regarding lottery participation.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">4. Subscription</h2>
          <p>
            By subscribing to Better Pick, you agree to pay the applicable fees. Subscriptions 
            automatically renew unless cancelled before the renewal date.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">5. Limitation of Liability</h2>
          <p>
            Better Pick shall not be liable for any direct, indirect, incidental, or consequential 
            damages arising from your use of the service or any lottery outcomes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
          <p>
            For questions about these terms, please contact us at support@betterpick.app
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
};

export default Terms;
