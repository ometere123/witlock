import { RouteCard, RouteShell, StatusRow } from '@/app/_components/RouteShell';

export default async function EvidencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RouteShell eyebrow={`Evidence studio · ${id}`} title="Provenance has a chain of custody." intro="Prepare a bounded evidence reference, publish the issuer record, and submit the exact matching fields. A hash alone is never shown as authenticity.">
    <section className="route-grid">
      <RouteCard title="Required match">
        <StatusRow label="Subject" value={`${id}:criterion`} ok />
        <StatusRow label="Issuer" value="Nominated external wallet" ok />
        <StatusRow label="Digest" value="Must match monolith attestation" ok />
        <StatusRow label="Source and claim" value="Must match monolith attestation" ok />
      </RouteCard>
      <RouteCard title="Unresolved authority" tone="warning">
        <p className="muted">The monolith attestation authenticates a wallet publication. It does not prove that the wallet is independent, that a domain belongs to the issuer, or that the claim is factually true.</p>
      </RouteCard>
    </section>
  </RouteShell>;
}
