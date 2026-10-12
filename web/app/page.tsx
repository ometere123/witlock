'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, FileCheck, Lock, Plus, Search, ShieldCheck, Wallet } from 'lucide-react';
import { CHAIN_HEX, CHAIN_ID, CONTRACT, EXPLORER, RPC, isTargetChain, provider, readClient, switchNetwork } from '@/lib/network';
import { readPendingTransaction, recoverPendingTransaction, submitWrite, type FinalizedTransaction, type PendingTransaction } from '@/lib/transactions';

type Tab = 'overview' | 'create' | 'inspect' | 'actions' | 'verification';
type Criterion = { id: string; question: string; weight: number; critical: boolean; issuer: string; verifier: string };

const WRITE_METHODS = [
  'accept_agreement', 'acknowledge_delivery', 'adjudicate', 'authenticate_appeal',
  'authenticate_evidence', 'begin_payment', 'confirm_payment_delivery', 'create_agreement',
  'expire_appeal', 'expire_draft', 'finalize_decision', 'finalize_inconclusive', 'fund_agreement',
  'mark_payment_ambiguous', 'open_appeal', 'open_dispute', 'post_operator_bond',
  'publish_attestation', 'reconcile_payment', 'resolve_appeal', 'seal_agreement',
  'submit_evidence', 'timeout_delivery', 'verify_attestation_source',
];

const ACTION_EXAMPLES: Record<string, string> = {
  accept_agreement: '["WL-2026-001"]',
  acknowledge_delivery: '["WL-2026-001"]',
  adjudicate: '["WL-2026-001"]',
  authenticate_appeal: '["WL-2026-001","64-lowercase-digest","64-lowercase-digest"]',
  authenticate_evidence: '["WL-2026-001","source","64-lowercase-digest"]',
  begin_payment: '["WL-2026-001","PROVIDER"]',
  confirm_payment_delivery: '["WL-2026-001",1,"64-lowercase-receipt","64-lowercase-delivery-evidence"]',
  expire_appeal: '["WL-2026-001"]',
  expire_draft: '["WL-2026-001"]',
  finalize_decision: '["WL-2026-001"]',
  finalize_inconclusive: '["WL-2026-001"]',
  fund_agreement: '["WL-2026-001"]',
  mark_payment_ambiguous: '["WL-2026-001",1,"64-lowercase-incident-digest"]',
  open_appeal: '["WL-2026-001","{\\"task_id\\":\\"source\\",\\"challenged_version\\":1,\\"basis\\":\\"A bounded contradiction requires review.\\",\\"digest\\":\\"64-lowercase-digest\\",\\"source\\":\\"https://appeal.example/review/1\\",\\"source_revision\\":\\"rev-1\\",\\"retrieval_method\\":\\"HTTPS_GET\\",\\"retrieved_at\\":1767225600,\\"claim\\":\\"The source contradicts the ruling.\\",\\"provenance_hash\\":\\"64-lowercase-digest\\"}"]',
  open_dispute: '["WL-2026-001","64-lowercase-reason-digest"]',
  publish_attestation: '["WL-2026-001","source","att-1","64-lowercase-digest","https://issuer.example/release/1","commit-1","HTTPS_GET",1767225600,"The source supports the criterion.","64-lowercase-provenance",0]',
  reconcile_payment: '["WL-2026-001",1,"64-lowercase-receipt"]',
  resolve_appeal: '["WL-2026-001"]',
  seal_agreement: '["WL-2026-001"]',
  submit_evidence: '["WL-2026-001","source","att-1"]',
  timeout_delivery: '["WL-2026-001"]',
  verify_attestation_source: '["WL-2026-001","source","att-1","64-lowercase-digest","64-lowercase-provenance"]',
};

const BIGINT_FIELDS: Record<string, number[]> = {
  create_agreement: [4, 5, 6, 7, 8],
  publish_attestation: [7, 10],
  authenticate_appeal: [],
  confirm_payment_delivery: [1],
  mark_payment_ambiguous: [1],
  reconcile_payment: [1],
};

function normalizeArgs(method: string, raw: unknown[]): unknown[] {
  return raw.map((value, index) => BIGINT_FIELDS[method]?.includes(index) ? BigInt(value as string | number) : value);
}

function short(value: string): string {
  return value.length > 18 ? `${value.slice(0, 10)}…${value.slice(-6)}` : value;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>('overview');
  const [account, setAccount] = useState('');
  const [chain, setChain] = useState('');
  const [msg, setMsg] = useState('');
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<FinalizedTransaction | null>(null);
  const [pending, setPending] = useState<PendingTransaction | null>(null);
  const [caseId, setCaseId] = useState('');
  const [operator, setOperator] = useState('');
  const [commitment, setCommitment] = useState('');
  const [lookup, setLookup] = useState('');
  const [actionMethod, setActionMethod] = useState(WRITE_METHODS[0]);
  const [actionArgs, setActionArgs] = useState(ACTION_EXAMPLES[WRITE_METHODS[0]]);
  const [acceptDeadline, setAcceptDeadline] = useState(() => Math.floor(Date.now() / 1000) + 86400);
  const [deliveryDeadline, setDeliveryDeadline] = useState(() => Math.floor(Date.now() / 1000) + 604800);
  const [appealDeadline, setAppealDeadline] = useState(() => Math.floor(Date.now() / 1000) + 691200);
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: 'source', question: 'Does the independently verified source support the frozen acceptance criterion?', weight: 100, critical: true, issuer: '', verifier: '' },
  ]);

  const wrongNetwork = !!chain && !isTargetChain(chain);
  const ready = !!account && !wrongNetwork && /^0x[a-f\d]{40}$/i.test(CONTRACT);
  const totalWeight = useMemo(() => criteria.reduce((sum, item) => sum + Number(item.weight), 0), [criteria]);

  async function refresh() {
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
    const injected = provider();
    if (!injected) return;
    void refresh();
    setPending(readPendingTransaction());
    const onAccount = () => { setReceipt(null); setMsg('Wallet account changed; verify the actor before the next action.'); void refresh(); };
    const onChain = () => { setReceipt(null); setMsg('Wallet network changed; only StudioNet 61999 writes are allowed.'); void refresh(); };
    injected.on?.('accountsChanged', onAccount);
    injected.on?.('chainChanged', onChain);
    return () => {
      injected.removeListener?.('accountsChanged', onAccount);
      injected.removeListener?.('chainChanged', onChain);
    };
  }, []);

  async function connect() {
    const injected = provider();
    if (!injected) { setMsg('Install an injected EIP-1193 wallet.'); return; }
    try { await injected.request({ method: 'eth_requestAccounts' }); await refresh(); setMsg('Wallet connected. Confirm the actor and network before signing.'); }
    catch (error) { setMsg((error as Error).message); }
  }

  async function fixNetwork() {
    const injected = provider();
    if (!injected) { setMsg('Install an injected EIP-1193 wallet.'); return; }
    try { await switchNetwork(injected); await refresh(); }
    catch (error) { setMsg((error as Error).message); }
  }

  async function write(method: string, args: unknown[]) {
    if (!ready) throw new Error('Connect an injected wallet on StudioNet 61999 with the verified contract configured.');
    setBusy(true); setMsg(`Submitting ${method}; waiting for FINALIZED and execution SUCCESS…`); setReceipt(null);
    try {
      const finalized = await submitWrite(account, method, args);
      setReceipt(finalized); setPending(null); setMsg(`${method} finalized successfully.`);
      return finalized;
    } finally { setBusy(false); }
  }

  async function createCase() {
    try {
      if (!/^[a-zA-Z0-9_-]{1,64}$/.test(caseId)) throw new Error('Case ID may contain only letters, numbers, underscores, or hyphens.');
      if (!/^0x[a-f\d]{40}$/i.test(operator) || operator.toLowerCase() === account.toLowerCase()) throw new Error('Provider must be a distinct wallet.');
      if (!/^[a-f\d]{64}$/.test(commitment)) throw new Error('Use a 64-character lowercase agreement SHA-256 commitment.');
      if (totalWeight !== 100) throw new Error('Criterion weights must total 100.');
      for (const criterion of criteria) {
        if (!/^[a-zA-Z0-9_-]{1,20}$/.test(criterion.id) || criterion.question.length < 20 || criterion.question.length > 400) throw new Error('Each criterion needs a bounded ID and question.');
        if (!/^0x[a-f\d]{40}$/i.test(criterion.issuer) || !/^0x[a-f\d]{40}$/i.test(criterion.verifier)) throw new Error('Each criterion needs issuer and verifier wallets.');
        if ([account.toLowerCase(), operator.toLowerCase()].includes(criterion.issuer.toLowerCase()) || [account.toLowerCase(), operator.toLowerCase(), criterion.issuer.toLowerCase()].includes(criterion.verifier.toLowerCase())) throw new Error('Issuer and verifier must be independent of the parties and each other.');
      }
      await write('create_agreement', [caseId, operator, JSON.stringify({ tasks: criteria }), commitment, BigInt(acceptDeadline), BigInt(deliveryDeadline), BigInt(appealDeadline), 0n, 0n]);
    } catch (error) { setMsg((error as Error).message); setBusy(false); }
  }

  async function inspect() {
    if (!CONTRACT || !lookup) return;
    setBusy(true); setMsg('Reading finalized chain state…');
    try {
      const value = await readClient().readContract({ address: CONTRACT as `0x${string}`, functionName: 'get_agreement', args: [lookup] });
      const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
      setResult(text || 'No agreement record.');
      setMsg('Read completed from StudioNet.');
    } catch (error) { setMsg((error as Error).message); }
    finally { setBusy(false); }
  }

  async function runAction() {
    try {
      const parsed = JSON.parse(actionArgs);
      if (!Array.isArray(parsed)) throw new Error('Arguments must be a JSON array.');
      await write(actionMethod, normalizeArgs(actionMethod, parsed));
    } catch (error) { setMsg((error as Error).message); setBusy(false); }
  }

  async function recover() {
    setBusy(true); setMsg('Recovering the persisted transaction and waiting for finality…');
    try { const recovered = await recoverPendingTransaction(); if (recovered) { setReceipt(recovered); setPending(null); setMsg('Persisted transaction finalized successfully.'); } else setMsg('No pending transaction found.'); }
    catch (error) { setMsg((error as Error).message); }
    finally { setBusy(false); }
  }

  function changeCriterion(index: number, patch: Partial<Criterion>) { setCriteria((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item)); }

  return <main className="wrap">
    <header className="nav"><a href="#" className="logo">WIT<span>LOCK</span></a><div className="row"><span className="mono">{wrongNetwork ? 'WRONG NETWORK' : 'STUDIONET · 61999'}</span><button className="button alt" onClick={wrongNetwork ? fixNetwork : connect}><Wallet size={15}/>{wrongNetwork ? 'Switch network' : account ? short(account) : 'Connect wallet'}</button></div></header>
    <section className="hero"><div><div className="label">THE PROOF-BOUND AGREEMENT PROTOCOL</div><h1>WORK DESERVES <span className="accent">PROOF.</span> PAYMENT DESERVES CERTAINTY.</h1><p className="muted">Clear commitments, independently verified sources, and bounded decisions. No settlement claim is presented as a payment while custody is disabled.</p><div className="row"><button className="button" onClick={() => { setTab('create'); document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); }}>Build agreement <ArrowRight size={16}/></button><button className="button alt" onClick={() => { setTab('verification'); document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); }}>Verify network</button></div><p className="mono muted">CANONICAL MONOLITH · CUSTODY DISABLED</p></div><div className="panel"><div className="line"><span className="label">EVIDENCE AUTHORITY</span><span className="label">VERIFY FIRST</span></div><h3>Proof beyond appearance.</h3><p className="muted">A digest, URL, issuer assertion, or finalized transaction is not external truth by itself.</p>{[['01','Source integrity'],['02','Issuer authority'],['03','Consensus classification'],['04','Recipient-side finality']].map(([n, title]) => <div className="line" key={n}><span className="mono">{n} / {title}</span><ShieldCheck color={n === '04' ? '#ef968f' : '#dbf895'} size={18}/></div>)}</div></section>
    <section className="section"><div className="label">THE WITLOCK METHOD</div><h2>Trust is a process.</h2><div className="grid"><div className="card"><Lock color="#dbf895"/><h3>Freeze the agreement</h3><p className="muted">Bounded criteria, parties, issuers, verifiers, and deadlines.</p></div><div className="card"><FileCheck color="#dbf895"/><h3>Verify the source</h3><p className="muted">An independent verifier authenticates the retrieval record before issuer evidence can enter the dossier.</p></div><div className="card"><ShieldCheck color="#dbf895"/><h3>Respect finality</h3><p className="muted">Every write waits for FINALIZED and execution SUCCESS, with a persistent recovery path.</p></div></div></section>
    <section className="section" id="workspace"><div className="label">PROTOCOL WORKSPACE</div><h2>The agreement desk.</h2><div className="workspace"><nav className="panel side">{([['overview','Overview'],['create','New agreement'],['inspect','Case explorer'],['actions','Lifecycle actions'],['verification','Verification']] as const).map(([key, title]) => <button key={key} className={tab === key ? 'selected' : ''} onClick={() => { setTab(key); setMsg(''); }}>{title}</button>)}</nav><div className="panel">
      {tab === 'overview' && <><h3>System status</h3><p className="muted">This client writes only through the injected EIP-1193 wallet and refuses writes on any network other than StudioNet 61999.</p><div className="line"><span>Chain ID</span><strong>{CHAIN_ID}</strong></div><div className="line"><span>Custody</span><strong style={{ color: '#ef968f' }}>DISABLED</strong></div><div className="line"><span>Contract</span><strong className="mono">{CONTRACT || 'NOT CONFIGURED'}</strong></div><div className="line"><span>Wallet</span><strong className="mono">{account || 'NOT CONNECTED'}</strong></div><div className="line"><span>Provider network</span><strong className="mono">{chain || 'UNKNOWN'}</strong></div>{pending && <div className="warning">Pending transaction {short(pending.hash)} is persisted locally. <button className="button alt" onClick={recover} disabled={busy}>Recover final receipt</button></div>}</>}
      {tab === 'create' && <><h3>Create agreement</h3><p className="muted">Zero-value creation freezes the parties, independent source verifiers, criteria, and deadlines. Funding and bonds remain unavailable while custody is disabled.</p><div className="field"><label>Case ID</label><input value={caseId} onChange={(event) => setCaseId(event.target.value)} placeholder="WL-2026-001"/></div><div className="field"><label>Provider wallet</label><input value={operator} onChange={(event) => setOperator(event.target.value)} placeholder="0x..."/></div><div className="field"><label>Agreement SHA-256 commitment</label><input value={commitment} onChange={(event) => setCommitment(event.target.value)} placeholder="64 lowercase hex characters"/></div><div className="grid"><div className="field"><label>Accept deadline · Unix seconds</label><input type="number" value={acceptDeadline} onChange={(event) => setAcceptDeadline(Number(event.target.value))}/></div><div className="field"><label>Delivery deadline · Unix seconds</label><input type="number" value={deliveryDeadline} onChange={(event) => setDeliveryDeadline(Number(event.target.value))}/></div><div className="field"><label>Appeal deadline · Unix seconds</label><input type="number" value={appealDeadline} onChange={(event) => setAppealDeadline(Number(event.target.value))}/></div></div><div className="line"><h3>Criteria · {totalWeight} / 100</h3><button className="button alt" disabled={criteria.length >= 8} onClick={() => setCriteria((current) => [...current, { id: '', question: '', weight: 0, critical: false, issuer: '', verifier: '' }])}><Plus size={14}/> Add</button></div>{criteria.map((criterion, index) => <div className="card" key={`${criterion.id}-${index}`} style={{ margin: '15px 0' }}><div className="line"><span>CRITERION {index + 1}</span><button className="button alt" onClick={() => setCriteria((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button></div><div className="field"><label>ID</label><input value={criterion.id} onChange={(event) => changeCriterion(index, { id: event.target.value })}/></div><div className="field"><label>Question</label><textarea value={criterion.question} onChange={(event) => changeCriterion(index, { question: event.target.value })}/></div><div className="grid"><div className="field"><label>Weight</label><input type="number" min="1" max="100" value={criterion.weight} onChange={(event) => changeCriterion(index, { weight: Number(event.target.value) })}/></div><div className="field"><label>Nominated issuer</label><input value={criterion.issuer} onChange={(event) => changeCriterion(index, { issuer: event.target.value })} placeholder="0x..."/></div><div className="field"><label>Independent verifier</label><input value={criterion.verifier} onChange={(event) => changeCriterion(index, { verifier: event.target.value })} placeholder="0x..."/></div></div><label><input type="checkbox" checked={criterion.critical} onChange={(event) => changeCriterion(index, { critical: event.target.checked })}/> Critical criterion</label></div>)}<p><button className="button" disabled={!ready || busy} onClick={createCase}>Submit agreement</button></p></>}
      {tab === 'inspect' && <><h3>Case explorer</h3><p className="muted">Reads are read-only. Use the lifecycle action desk for wallet writes and inspect each finalized transaction below.</p><div className="field"><label>Case ID</label><input value={lookup} onChange={(event) => setLookup(event.target.value)} placeholder="WL-2026-001"/></div><button className="button" disabled={!lookup || busy} onClick={inspect}><Search size={14}/> Read case state</button><pre className="code">{result || 'No case queried'}</pre></>}
      {tab === 'actions' && <><h3>Lifecycle action desk</h3><p className="muted">Every write is wallet/network guarded, persisted before waiting, and accepted only after FINALIZED plus execution SUCCESS. Role authorization is enforced by the monolith.</p><div className="field"><label>Method</label><select value={actionMethod} onChange={(event) => { const method = event.target.value; setActionMethod(method); setActionArgs(ACTION_EXAMPLES[method] || '["WL-2026-001"]'); }}>{WRITE_METHODS.map((method) => <option key={method} value={method}>{method}</option>)}</select></div><div className="field"><label>Arguments · JSON array</label><textarea value={actionArgs} onChange={(event) => setActionArgs(event.target.value)} rows={7}/></div><p className="muted small-copy">Use exact contract schema. Appeal grounds require task ID, challenged decision version, bounded basis, source coordinate, content digest, and independent verifier authentication. Payment methods remain custody-gated.</p><button className="button" disabled={!ready || busy} onClick={runAction}>Run {actionMethod}</button></>}
      {tab === 'verification' && <><h3>Verification checklist</h3>{[['Chain', String(CHAIN_ID)], ['RPC', RPC], ['Wallet network', chain || 'INCONCLUSIVE'], ['Contract', CONTRACT || 'NONE'], ['Custody', 'DISABLED'], ['Source parity', 'See deployment manifest'], ['Finalized execution', 'Required for every write'], ['Recipient receipt', 'NOT VERIFIED — payment disabled']].map(([key, value]) => <div className="line" key={key}><span>{key}</span><span className="mono">{value}</span></div>)}<p><a className="button alt" href={EXPLORER} target="_blank" rel="noreferrer">StudioNet explorer ↗</a></p></>}
      {msg && <p className="notice">{msg}</p>}{receipt && <div className="success"><strong>{receipt.method || 'Transaction'} · {receipt.status} · {receipt.execution}</strong><br/><a href={receipt.explorer} target="_blank" rel="noreferrer">View finalized transaction ↗</a></div>}
    </div></div></section>
  </main>;
}
