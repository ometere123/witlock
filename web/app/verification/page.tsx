import { RouteCard, RouteShell, StatusRow } from '@/app/_components/RouteShell';
import { CHAIN_ID, EXPLORER, RPC } from '@/lib/network';

export default function VerificationPage() {
  return <RouteShell eyebrow="Network health" title="Verify the deployment before you trust the state." intro="The health surface presents configuration and evidence separately. A configured endpoint is not a verified contract deployment.">
    <section className="route-grid">
      <RouteCard title="Approved network">
        <StatusRow label="Chain" value={`GenLayer StudioNet · ${CHAIN_ID}`} ok />
        <StatusRow label="RPC" value={RPC} ok />
        <StatusRow label="Explorer" value={EXPLORER} ok />
        <StatusRow label="Custody" value="Disabled" />
      </RouteCard>
      <RouteCard title="Proof checklist">
        <StatusRow label="Contract source parity" value="Verify explorer source hash" />
        <StatusRow label="Schema parity" value="Verify deployed method schema" />
        <StatusRow label="Finalized execution" value="Inspect each transaction" />
        <StatusRow label="Recipient delivery" value="Not applicable while custody is disabled" />
      </RouteCard>
    </section>
  </RouteShell>;
}
