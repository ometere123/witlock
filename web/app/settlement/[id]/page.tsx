import { RouteCard, RouteShell, StatusRow, DisabledAction } from '@/app/_components/RouteShell';
import CaseConsole from '@/app/_components/CaseConsole';

export default async function SettlementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RouteShell eyebrow={`Settlement guard · ${id}`} title="Economic certainty starts with a real receipt." intro="This surface reports frozen entitlements, native dispatch, and external delivery observation separately.">
    <section className="route-grid">
      <RouteCard title="Current gate">
        <StatusRow label="Decision" value="May be approved independently" />
        <StatusRow label="Native dispatch" value="Finalized decision only" ok />
        <StatusRow label="Delivery" value="External balance observation required" />
        <DisabledAction>Deposit unavailable</DisabledAction>
      </RouteCard>
      <RouteCard title="Why it stays closed" tone="warning">
        <p className="muted">An accepted or finalized parent transaction cannot prove that an asynchronous child transfer succeeded or reached its recipient. WITLOCK will not retry ambiguous transfers or recreate missing funds in accounting.</p>
      </RouteCard>
    </section>
    <CaseConsole caseId={id} surface="settlement" />
  </RouteShell>;
}
