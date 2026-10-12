import Link from 'next/link';
import { RouteCard, RouteShell, StatusRow } from '@/app/_components/RouteShell';

export default function WorkspacePage() {
  return <RouteShell eyebrow="My workspace" title="Every obligation, one clear state." intro="The workspace is organized around actions that can be proven on chain: accept, submit, authenticate, seal, adjudicate, appeal, and inspect history.">
    <section className="route-grid">
      <RouteCard title="Requester actions">
        <StatusRow label="Draft agreements" value="Read from deployment" />
        <StatusRow label="Evidence review" value="Waiting for issuer records" />
        <StatusRow label="Sealing" value="Requires connected requester" />
        <Link className="button alt" href="/#workspace">Open live workspace</Link>
      </RouteCard>
      <RouteCard title="Provider actions">
        <StatusRow label="Acceptance" value="Deadline-bound" />
        <StatusRow label="Delivery evidence" value="Bounded and replay-protected" ok />
        <StatusRow label="Appeal" value="One bounded reason digest" ok />
      </RouteCard>
    </section>
  </RouteShell>;
}
