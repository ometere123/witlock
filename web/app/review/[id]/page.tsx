import { RouteCard, RouteShell, StatusRow } from '@/app/_components/RouteShell';
import CaseConsole from '@/app/_components/CaseConsole';

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RouteShell eyebrow={`Review · ${id}`} title="Let validators judge the claim, not the payout." intro="The decision engine asks a narrow semantic question after deterministic checks have admitted evidence.">
    <section className="route-grid">
      <RouteCard title="Bounded finding">
        <StatusRow label="Allowed labels" value="PASS · FAIL · INCONCLUSIVE" ok />
        <StatusRow label="Model chooses money" value="No" ok />
        <StatusRow label="Missing authority" value="INCONCLUSIVE or rejected" ok />
        <p className="muted">The contract maps labels to status and frozen weights. Explanation prose has no economic effect.</p>
      </RouteCard>
      <RouteCard title="Appeal window">
        <p className="muted">One party may submit one reason digest before the frozen appeal deadline. Resolving the appeal reruns the bounded consensus task and preserves the earlier decision in history.</p>
      </RouteCard>
    </section>
    <CaseConsole caseId={id} surface="review" />
  </RouteShell>;
}
