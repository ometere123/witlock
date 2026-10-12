'use client';

import Link from 'next/link';
import { ExternalLink, RefreshCw, Search, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CHAIN_ID, CONTRACT, EXPLORER, isTargetChain, provider, readClient, switchNetwork } from '@/lib/network';

type JsonRecord = Record<string, unknown>;

function parse(value: unknown): JsonRecord | null {
  if (typeof value !== 'string' || !value) return null;
  try { return JSON.parse(value) as JsonRecord; } catch { return { raw: value }; }
}

function short(value: unknown): string {
  const text = String(value || '');
  return text.length > 22 ? `${text.slice(0, 10)}…${text.slice(-8)}` : text || '—';
}

export default function CaseLookup({ title = 'Read a live agreement' }: { title?: string }) {
  const [caseId, setCaseId] = useState('');
  const [account, setAccount] = useState('');
  const [chain, setChain] = useState('');
  const [state, setState] = useState<JsonRecord | null>(null);
  const [decision, setDecision] = useState<JsonRecord | null>(null);
  const [settlement, setSettlement] = useState<JsonRecord | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function refreshWallet() {
    const injected = provider();
    if (!injected) return;
    try {
      const accounts = (await injected.request({ method: 'eth_accounts' })) as string[];
      setAccount(accounts[0] || '');
      setChain(String(await injected.request({ method: 'eth_chainId' })));
    } catch {
      setAccount('');
      setChain('');
    }
  }

  useEffect(() => {
    void refreshWallet();
  }, []);

  async function connect() {
    const injected = provider();
    if (!injected) { setMessage('An injected EIP-1193 wallet is required.'); return; }
    try {
      await injected.request({ method: 'eth_requestAccounts' });
      await refreshWallet();
      setMessage('Wallet connected. Reads remain read-only.');
    } catch (error) { setMessage((error as Error).message); }
  }

  async function fixNetwork() {
    const injected = provider();
    if (!injected) { setMessage('An injected EIP-1193 wallet is required.'); return; }
    try { await switchNetwork(injected); await refreshWallet(); }
    catch (error) { setMessage((error as Error).message); }
  }

  async function inspect() {
    if (!caseId.trim()) { setMessage('Enter the exact agreement key.'); return; }
    if (!CONTRACT) { setMessage('No verified current-source contract address is configured.'); return; }
    setBusy(true);
    setMessage('Reading finalized StudioNet state…');
    try {
      const client = readClient();
      const [rawState, rawDecision, rawSettlement] = await Promise.all([
        client.readContract({ address: CONTRACT as `0x${string}`, functionName: 'get_agreement', args: [caseId.trim()] }),
        client.readContract({ address: CONTRACT as `0x${string}`, functionName: 'get_decision', args: [caseId.trim()] }),
        client.readContract({ address: CONTRACT as `0x${string}`, functionName: 'get_settlement', args: [caseId.trim()] }),
      ]);
      const nextState = parse(rawState);
      setState(nextState);
      setDecision(parse(rawDecision));
      setSettlement(parse(rawSettlement));
      setMessage(nextState ? 'Read completed from the configured contract.' : 'No agreement record was returned for that key.');
    } catch (error) {
      setState(null); setDecision(null); setSettlement(null);
      setMessage((error as Error).message);
    } finally { setBusy(false); }
  }

  const terms = state?.terms && typeof state.terms === 'object' && state.terms !== null ? state.terms as { tasks?: unknown[] } : null;
  const wrongNetwork = !!chain && !isTargetChain(chain);

  return <section className="panel live-lookup">
    <div className="line"><div><div className="label">LIVE READ</div><h2>{title}</h2></div><div className="row"><span className="mono">{wrongNetwork ? 'WRONG NETWORK' : `STUDIONET · ${CHAIN_ID}`}</span><button className="button alt" onClick={wrongNetwork ? fixNetwork : connect}><Wallet size={14} />{account ? short(account) : wrongNetwork ? 'Switch network' : 'Connect wallet'}</button></div></div>
    <p className="muted">Enter a case key to read agreement, decision, and allocation records from the configured contract. This surface never fills missing state with fixtures.</p>
    <div className="lookup-form"><div className="field"><label htmlFor="case-lookup">Agreement key</label><input id="case-lookup" value={caseId} onChange={(event) => setCaseId(event.target.value)} placeholder="WL-2026-001" /></div><button className="button" onClick={() => void inspect()} disabled={busy || wrongNetwork}><Search size={14} />{busy ? 'Reading…' : 'Read state'}</button><button className="button alt" onClick={() => void inspect()} disabled={busy || !state}><RefreshCw size={14} />Refresh</button></div>
    {!CONTRACT && <div className="warning">The current source has no verified deployed contract address. Reads and writes stay disabled until a fresh StudioNet deployment reaches successful finalized execution.</div>}
    {message && <p className="notice">{message}</p>}
    {state && <div className="lookup-result">
      <div className="metric-grid"><div className="metric"><span className="label">STATUS</span><strong>{String(state.status || 'UNKNOWN')}</strong></div><div className="metric"><span className="label">DECISION</span><strong>{String(state.result || 'PENDING')}</strong></div><div className="metric"><span className="label">VERSION</span><strong>{String(state.decision_version || 0)}</strong></div><div className="metric"><span className="label">CRITERIA</span><strong>{terms?.tasks?.length || 0}</strong></div></div>
      <div className="line"><span>Requester</span><span className="mono">{short(state.requester)}</span></div><div className="line"><span>Provider</span><span className="mono">{short(state.provider)}</span></div><div className="line"><span>Appeal</span><span>{String(state.appeal_status || 'NONE')}</span></div><div className="line"><span>Settlement</span><span>{String(settlement?.settlement_status || state.settlement_status || '—')}</span></div>
      {decision && <pre className="code">{JSON.stringify(decision, null, 2)}</pre>}
      <div className="row"><Link className="button alt" href={`/agreement/${encodeURIComponent(caseId.trim())}`}>Agreement <ExternalLink size={14} /></Link><Link className="button alt" href={`/evidence/${encodeURIComponent(caseId.trim())}`}>Evidence <ExternalLink size={14} /></Link><Link className="button alt" href={`/review/${encodeURIComponent(caseId.trim())}`}>Review <ExternalLink size={14} /></Link><Link className="button alt" href={`/settlement/${encodeURIComponent(caseId.trim())}`}>Settlement <ExternalLink size={14} /></Link></div>
    </div>}
    <p className="small-copy muted">Contract: <span className="mono">{CONTRACT || 'NOT CONFIGURED'}</span> · <a href={EXPLORER} target="_blank" rel="noreferrer">Explorer ↗</a></p>
  </section>;
}
