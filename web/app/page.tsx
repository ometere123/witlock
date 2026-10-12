import { ArrowRight, FileCheck, Lock, Scale, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const routes = [
  { href: '/new', number: '01', title: 'Create an agreement', copy: 'Freeze parties, criteria, independent verifiers, commitments, and deadlines before work begins.', icon: Lock },
  { href: '/explore', number: '02', title: 'Explore a case', copy: 'Open an exact case key and read agreement, decision, evidence, and settlement state from chain.', icon: FileCheck },
  { href: '/workspace', number: '03', title: 'Run the workflow', copy: 'Move through acceptance, evidence, dispute, sealing, adjudication, appeal, and history by role.', icon: Scale },
  { href: '/verification', number: '04', title: 'Verify the network', copy: 'Check the approved StudioNet endpoint, current-source contract binding, custody flag, and wallet chain.', icon: ShieldCheck },
];

export default function Home() {
  return <main className="wrap landing-page">
    <section className="hero landing-hero">
      <div>
        <div className="label">THE PROOF-BOUND AGREEMENT PROTOCOL</div>
        <h1>WORK DESERVES <span className="accent">PROOF.</span><br />PAYMENT DESERVES CERTAINTY.</h1>
        <p className="muted">WITLOCK freezes agreements, verifies external evidence, and records bounded decisions on GenLayer StudioNet. Open a route for the job you need; every case surface reads the actual state before presenting the next action.</p>
        <div className="row landing-actions"><Link className="button" href="/new">Create an agreement <ArrowRight size={16} /></Link><Link className="button alt" href="/explore">Explore a case</Link></div>
        <p className="mono muted">STUDIONET · 61999 · ZERO-VALUE AGREEMENTS · CUSTODY DISABLED</p>
      </div>
      <aside className="panel landing-proof">
        <div className="line"><span className="label">WITLOCK ROUTES</span><span className="label">READ THE STATE</span></div>
        <h2>One case, several accountable surfaces.</h2>
        <p className="muted">Creation, evidence, review, settlement, verification, and receipt recovery each have their own addressable page.</p>
        <div className="line"><span className="mono">01 / Frozen agreement</span><ShieldCheck color="#dbf895" size={18} /></div>
        <div className="line"><span className="mono">02 / Source authority</span><ShieldCheck color="#dbf895" size={18} /></div>
        <div className="line"><span className="mono">03 / Consensus decision</span><ShieldCheck color="#dbf895" size={18} /></div>
        <div className="line"><span className="mono">04 / Finalized receipt</span><ShieldCheck color="#ef968f" size={18} /></div>
      </aside>
    </section>

    <section className="section landing-routes" aria-labelledby="routes-heading">
      <div className="label">THE WITLOCK ROUTE MAP</div>
      <h2 id="routes-heading">Choose the surface for the work.</h2>
      <div className="route-grid route-map-grid">{routes.map(({ href, number, title, copy, icon: Icon }) => <Link className="card route-link-card" href={href} key={href}><div className="line"><span className="mono accent">{number}</span><Icon color="#dbf895" size={20} /></div><h3>{title}</h3><p className="muted">{copy}</p><span className="route-arrow">Open route <ArrowRight size={14} /></span></Link>)}</div>
    </section>

    <section className="section landing-notes">
      <div className="grid">
        <article className="card"><div className="label">WHAT IS FROZEN</div><h3>Terms and provenance</h3><p className="muted">The canonical contract owns agreement state, issuer attestations, source observations, decisions, appeal history, and deterministic allocation calculations.</p></article>
        <article className="card"><div className="label">WHAT IS READ</div><h3>Finalized chain state</h3><p className="muted">Empty, unavailable, or failed reads stay visible as those states. The interface does not insert sample cases or demo transactions.</p></article>
        <article className="card"><div className="label">WHAT STAYS CLOSED</div><h3>Native custody</h3><p className="muted">WITLOCK reports decisions and allocations while payment custody remains disabled. No route claims that an allocation delivered GEN.</p></article>
      </div>
    </section>
  </main>;
}
