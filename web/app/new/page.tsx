import { RouteCard, RouteShell, StatusRow } from '@/app/_components/RouteShell';
import AgreementCreator from '@/app/_components/AgreementCreator';
import Link from 'next/link';

export default function NewAgreementPage() {
  return <RouteShell eyebrow="Creation desk" title="Freeze the terms before the work begins." intro="Create a funded or zero-value agreement with bounded criteria, distinct parties, independent verifiers, and ordered deadlines."
  >
    <section className="route-grid">
      <RouteCard title="Creation sequence">
        <StatusRow label="1 · Parties" value="Requester and provider" ok />
        <StatusRow label="2 · Criteria" value="1–2 bounded weighted questions" ok />
        <StatusRow label="3 · Issuers" value="External nominated wallets" ok />
        <StatusRow label="4 · Deadlines" value="Acceptance · delivery · appeal" ok />
        <Link className="button" href="/guide">Read the creation guide</Link>
      </RouteCard>
      <RouteCard title="Before submitting">
        <p className="muted">The terms digest is a commitment to the full agreement document. The contract freezes the criterion set and does not allow later edits.</p>
        <p className="muted">Positive funding is sent in a separate exact-value transaction. Finalized role entitlements can be dispatched only after the appeal window closes.</p>
      </RouteCard>
    </section>
    <AgreementCreator />
  </RouteShell>;
}
