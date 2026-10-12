import Link from 'next/link';
import { RouteCard, RouteShell, StatusRow } from '@/app/_components/RouteShell';

export default async function AgreementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RouteShell eyebrow={`Agreement · ${id}`} title="A frozen decision record." intro="Agreement details are read-only until the connected wallet performs an authorized state transition.">
    <section className="route-grid">
      <RouteCard title="Frozen terms">
        <StatusRow label="Case key" value={id} ok />
        <StatusRow label="Policy" value="Immutable after creation" ok />
        <StatusRow label="Decision" value="Read from finalized state" />
        <p><Link className="button alt" href={`/evidence/${id}`}>Evidence studio</Link></p>
      </RouteCard>
      <RouteCard title="Timeline">
        <p className="muted">Created → accepted → evidence authenticated → sealed → adjudicated → appealed, where applicable. Each step has a separate revision and actor.</p>
        <Link className="button alt" href={`/review/${id}`}>Open review</Link>
      </RouteCard>
    </section>
  </RouteShell>;
}
