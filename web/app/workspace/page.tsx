import Link from 'next/link';
import CaseLookup from '@/app/_components/CaseLookup';
import { RouteCard, RouteShell, StatusRow } from '@/app/_components/RouteShell';

export default function WorkspacePage() {
  return <RouteShell eyebrow="My workspace" title="Every obligation, one clear state." intro="The workspace is organized around actions that can be proven on chain: accept, submit, authenticate, seal, adjudicate, appeal, and inspect history.">
    <section className="route-grid">
      <RouteCard title="Requester actions">
        <StatusRow label="Draft agreements" value="Read by exact case key" />
        <StatusRow label="Evidence review" value="Read from finalized state" />
        <StatusRow label="Sealing" value="Role and state gated" ok />
        <Link className="button alt" href="/new">Create a case</Link>
      </RouteCard>
      <RouteCard title="Provider actions">
        <StatusRow label="Acceptance" value="Deadline-bound" />
        <StatusRow label="Delivery evidence" value="Bounded and replay-protected" ok />
        <StatusRow label="Appeal" value="One bounded reason digest" ok />
      </RouteCard>
    </section>
    <CaseLookup title="Open a case in your workspace" />
  </RouteShell>;
}
