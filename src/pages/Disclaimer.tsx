import { PolicyLayout } from "@/components/PolicyLayout";

const Disclaimer = () => {
  return (
    <PolicyLayout title="Disclaimer">
      <div className="space-y-6 text-muted-foreground">
        <p className="text-lg">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Informational Service Only</h2>
          <p>
            Better Pick is an informational software service. We provide structured 
            number-selection guidance to help users make more thoughtful choices when 
            playing the lottery.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Randomness of Lottery Outcomes</h2>
          <p>
            Lottery outcomes are random and determined by chance. Better Pick does not 
            predict results, guarantee winnings, or alter lottery odds in any way.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Not a Ticket Seller or Betting Service</h2>
          <p>
            We do not sell lottery tickets or place bets on behalf of users. Better Pick 
            is solely an informational tool. Users are responsible for purchasing their 
            own tickets through authorized retailers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">No Affiliation</h2>
          <p>
            Better Pick is not affiliated with, endorsed by, or connected to the 
            Massachusetts State Lottery or any other lottery operator.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Responsible Play</h2>
          <p>
            We encourage responsible lottery play. Set a budget for lottery purchases 
            and never spend more than you can afford to lose. If you or someone you 
            know has a gambling problem, please seek help.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p>
            For questions about this disclaimer, please contact us at info@ninetynineweb.com
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
};

export default Disclaimer;
