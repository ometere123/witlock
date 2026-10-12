import Link from 'next/link';
import { RouteCard, RouteShell, StatusRow } from '@/app/_components/RouteShell';

export default function ExplorePage() {
  return <RouteShell eyebrow="Agreement index" title="Explore the proof surface." intro="Read verified agreement state from the configured StudioNet deployment. Empty or unconfigured state is shown as a fact, never filled with sample users or fabricated cases.">
    <section className="route-grid">
      <RouteCard title="Configured deployment">
        <StatusRow label="Network" value="StudioNet · 61999" ok />
        <StatusRow label="Agreement address" value="Configured in environment" />
        <StatusRow label="Registry address" value="Configured in environment" />
        <p className="muted small-copy">Use the interactive explorer on the home route after verified addresses are supplied.</p>
        <Link className="button" href="/#workspace">Open case explorer</Link>
      </RouteCard>
      <RouteCard title="What appears here">
        <p className="muted">Cases are discoverable only through live contract reads. Each record includes its frozen parties, deadlines, current state, decision history, and separate transaction references.</p>
        <p className="muted">A pending, failed, or unconfigured read stays visible as pending, failed, or unconfigured.</p>
      </RouteCard>
    </section>
  </RouteShell>;
}
