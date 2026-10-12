import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, LockKeyhole } from 'lucide-react';

export function RouteShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main className="wrap route-page">
      <section className="route-hero">
        <Link href="/" className="back-link"><ArrowLeft size={15} /> Home</Link>
        <div className="label">{eyebrow}</div>
        <h1>{title}</h1>
        <p className="muted route-intro">{intro}</p>
      </section>
      {children}
    </main>
  );
}

export function RouteCard({ title, children, tone = 'default' }: { title: string; children: React.ReactNode; tone?: 'default' | 'warning' }) {
  return <article className={`route-card ${tone === 'warning' ? 'route-warning' : ''}`}><h2>{title}</h2>{children}</article>;
}

export function StatusRow({ label, value, ok = false }: { label: string; value: string; ok?: boolean }) {
  return <div className="line"><span>{label}</span><span className={`status-value ${ok ? 'status-ok' : ''}`}>{ok ? <CheckCircle2 size={14} /> : <CircleAlert size={14} />}{value}</span></div>;
}

export function DisabledAction({ children }: { children: React.ReactNode }) {
  return <button className="button disabled-action" disabled><LockKeyhole size={14} />{children}</button>;
}

export function ContinueLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="button alt inline-link" href={href}>{children}<ArrowRight size={14} /></Link>;
}
