import { RouteCard, RouteShell } from '@/app/_components/RouteShell';

export default function GuidePage() {
  return <RouteShell eyebrow="Protocol guide" title="Proof before confidence." intro="WITLOCK is designed around the limits of evidence, consensus, and asynchronous transaction finality.">
    <section className="route-grid">
      <RouteCard title="What WITLOCK proves">
        <p className="muted">A case freezes terms. A registry record proves which wallet published bounded evidence. An issuer authentication call proves the record matches the nominated authority. GenLayer consensus produces a bounded semantic classification.</p>
      </RouteCard>
      <RouteCard title="What WITLOCK does not prove">
        <p className="muted">A digest does not prove truth. A wallet does not prove a human identity. A URL does not prove authority. A finalized transaction does not prove an external payment reached its recipient.</p>
      </RouteCard>
    </section>
  </RouteShell>;
}
