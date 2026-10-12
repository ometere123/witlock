import { RouteCard, RouteShell, StatusRow } from '@/app/_components/RouteShell';
import Link from 'next/link';

export default function NewAgreementPage() {
  return <RouteShell eyebrow="Creation desk" title="Freeze the terms before the work begins." intro="The creation form lives on the home workspace so wallet connection, network blocking, and transaction submission stay in one verified flow.">
    <section className="route-grid">
      <RouteCard title="Creation sequence">
        <StatusRow label="1 · Parties" value="Requester and provider" ok />
        <StatusRow label="2 · Criteria" value="1–4 bounded weighted questions" ok />
        <StatusRow label="3 · Issuers" value="External nominated wallets" ok />
        <StatusRow label="4 · Deadlines" value="Acceptance · delivery · appeal" ok />
        <Link className="button" href="/#workspace">Start in workspace</Link>
      </RouteCard>
      <RouteCard title="Before submitting">
        <p className="muted">The terms digest is a commitment to the full agreement document. The contract freezes the criterion set and does not allow later edits.</p>
        <p className="muted">A successful submission creates a case. It does not fund custody or authorize a payment.</p>
      </RouteCard>
    </section>
  </RouteShell>;
}
