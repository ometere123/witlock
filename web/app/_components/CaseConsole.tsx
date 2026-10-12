'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, CircleAlert, ExternalLink, RefreshCw, Wallet } from 'lucide-react';
import { CONTRACT, CHAIN_ID, EXPLORER, isTargetChain, provider, readClient, switchNetwork } from '@/lib/network';
import { submitWrite, TransactionExecutionError, type FinalizedTransaction } from '@/lib/transactions';

type CaseConsoleProps = { caseId: string; surface: 'agreement' | 'evidence' | 'review' | 'settlement' };
type FieldMap = Record<string, string>;

const emptyFields: FieldMap = {};

function asText(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value ?? '', null, 2);
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function Field({ label, name, value, onChange, placeholder, multiline = false }: { label: string; name: string; value: string; onChange: (name: string, value: string) => void; placeholder?: string; multiline?: boolean }) {
  return <div className="field"><label htmlFor={name}>{label}</label>{multiline ? <textarea id={name} value={value} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} /> : <input id={name} value={value} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} />}</div>;
}

export default function CaseConsole({ caseId, surface }: CaseConsoleProps) {
  const [account, setAccount] = useState('');
  const [chain, setChain] = useState('');
  const [state, setState] = useState<Record<string, unknown> | null>(null);
  const [decision, setDecision] = useState<Record<string, unknown> | null>(null);
  const [evidence, setEvidence] = useState<Record<string, unknown> | null>(null);
  const [history, setHistory] = useState<Record<string, unknown>[]>([]);
  const [settlement, setSettlement] = useState<Record<string, unknown> | null>(null);
  const [accounting, setAccounting] = useState<Record<string, unknown> | null>(null);
  const [fields, setFields] = useState<FieldMap>(emptyFields);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<FinalizedTransaction | null>(null);

  const status = String(state?.status || 'UNKNOWN');
  const tasks = useMemo(() => {
    const tasks = state?.terms && typeof state.terms === 'object' && state.terms !== null
      ? (state.terms as { tasks?: Array<{ id?: string; issuer?: string; verifier?: string }> }).tasks || []
      : [];
    return tasks.filter((task) => task.id);
  }, [state]);
  const taskIds = useMemo(() => tasks.map((task) => task.id || '').filter(Boolean), [tasks]);
  const walletMatches = (value: unknown) => typeof value === 'string' && !!account && value.toLowerCase() === account.toLowerCase();
  const isRequester = walletMatches(state?.requester);
  const isProvider = walletMatches(state?.provider);
  const isParty = isRequester || isProvider;
  const isIssuer = tasks.some((task) => walletMatches(task.issuer));
  const isVerifier = tasks.some((task) => walletMatches(task.verifier));

  async function refresh() {
    if (!CONTRACT) { setMessage('The verified contract address is not configured.'); return; }
    setBusy(true);
    try {
      const client = readClient();
      const [rawState, rawDecision, rawSettlement, rawAccounting] = await Promise.all([
        client.readContract({ address: CONTRACT as `0x${string}`, functionName: 'get_agreement', args: [caseId] }),
        client.readContract({ address: CONTRACT as `0x${string}`, functionName: 'get_decision', args: [caseId] }),
        client.readContract({ address: CONTRACT as `0x${string}`, functionName: 'get_settlement', args: [caseId] }),
        client.readContract({ address: CONTRACT as `0x${string}`, functionName: 'get_accounting', args: [caseId] }),
      ]);
      const parse = (value: unknown): Record<string, unknown> | null => {
        const text = typeof value === 'string' ? value : '';
        if (!text) return null;
        try { return JSON.parse(text) as Record<string, unknown>; } catch { return { raw: text }; }
      };
      const parsedState = parse(rawState);
      setState(parsedState);
      setDecision(parse(rawDecision));
      setSettlement(parse(rawSettlement));
      setAccounting(parse(rawAccounting));
      if (parsedState?.appeal_grounds && typeof parsedState.appeal_grounds === 'string') {
        try {
          const grounds = JSON.parse(parsedState.appeal_grounds) as FieldMap;
          setFields((current) => ({ ...current, ...grounds, basis: grounds.basis || current.basis || '' }));
        } catch { /* The contract state remains the source of truth if grounds are malformed. */ }
      }
      const firstTask = parsedState?.terms && typeof parsedState.terms === 'object' && parsedState.terms !== null
        ? ((parsedState.terms as { tasks?: Array<{ id?: string }> }).tasks || [])[0]?.id
        : undefined;
      if (firstTask) {
        const rawEvidence = await client.readContract({ address: CONTRACT as `0x${string}`, functionName: 'get_evidence', args: [caseId, firstTask] });
        setEvidence(parse(rawEvidence));
      } else setEvidence(null);
      const revision = Number(parsedState?.revision || 0);
      if (revision > 0 && revision <= 32) {
        const rawHistory = await Promise.all(Array.from({ length: revision }, (_, index) => client.readContract({ address: CONTRACT as `0x${string}`, functionName: 'get_history', args: [caseId, BigInt(index + 1)] })));
        setHistory(rawHistory.map(parse).filter((item): item is Record<string, unknown> => !!item));
      } else setHistory([]);
      setMessage('Read completed from finalized StudioNet state.');
    } catch (error) {
      setMessage((error as Error).message);
    } finally { setBusy(false); }
  }

  async function wallet() {
    const injected = provider();
    if (!injected) { setMessage('An injected EIP-1193 wallet is required.'); return; }
    try {
      await injected.request({ method: 'eth_requestAccounts' });
      setAccount(((await injected.request({ method: 'eth_accounts' })) as string[])[0] || '');
      setChain(String(await injected.request({ method: 'eth_chainId' })));
    } catch (error) { setMessage((error as Error).message); }
  }

  useEffect(() => {
    void refresh();
    const injected = provider();
    if (!injected) return;
    const onAccount = (accounts: unknown) => setAccount(Array.isArray(accounts) ? String(accounts[0] || '') : '');
    const onChain = (value: unknown) => setChain(String(value || ''));
    injected.on?.('accountsChanged', onAccount);
    injected.on?.('chainChanged', onChain);
    return () => {
      injected.removeListener?.('accountsChanged', onAccount);
      injected.removeListener?.('chainChanged', onChain);
    };
  }, [caseId]);

  function change(name: string, value: string) { setFields((current) => ({ ...current, [name]: value })); }

  async function act(method: string, args: unknown[]) {
    if (!account) throw new Error('Connect the wallet for the actor authorized by this action.');
    if (!isTargetChain(chain)) throw new Error(`Switch the wallet to StudioNet ${CHAIN_ID} before signing.`);
    setBusy(true); setReceipt(null); setMessage(`Submitting ${method}; waiting for FINALIZED and FINISHED_WITH_RETURN…`);
    try {
      const result = await submitWrite(account, method, args);
      setReceipt(result); setMessage(`${method} finalized with successful GenVM execution.`); await refresh();
    } catch (error) {
      if (error instanceof TransactionExecutionError) { setReceipt(error.transaction); setMessage(`Finalized with execution ${error.transaction.execution}; inspect the receipt before retrying.`); }
      else setMessage((error as Error).message);
    } finally { setBusy(false); }
  }

  async function run(method: string, args: unknown[]) {
    try { await act(method, args); } catch (error) { setMessage((error as Error).message); setBusy(false); }
  }

  async function publish() {
    try {
      const contentDigest = fields.digest || await sha256(fields.content || '');
      const provenance = await sha256(`${caseId}:${fields.task_id}|${fields.source}|${fields.source_revision}|${contentDigest}`);
      setFields((current) => ({ ...current, digest: contentDigest, provenance_hash: provenance }));
      await run('publish_attestation', [caseId, fields.task_id, fields.attestation_id, contentDigest, fields.source, fields.source_revision, 'HTTPS_GET', BigInt(fields.retrieved_at || Math.floor(Date.now() / 1000)), fields.claim, provenance, BigInt(fields.expires_at || 0)]);
    } catch (error) { setMessage((error as Error).message); }
  }

  async function openAppeal() {
    try {
      const contentDigest = fields.digest || await sha256(fields.content || '');
      const provenance = await sha256(`${caseId}:${fields.task_id}|${fields.source}|${fields.source_revision}|${contentDigest}`);
      setFields((current) => ({ ...current, digest: contentDigest, provenance_hash: provenance }));
      const grounds = JSON.stringify({ task_id: fields.task_id, challenged_version: Number(fields.challenged_version), basis: fields.basis, digest: contentDigest, source: fields.source, source_revision: fields.source_revision, retrieval_method: 'HTTPS_GET', retrieved_at: Number(fields.retrieved_at || Math.floor(Date.now() / 1000)), claim: fields.claim, provenance_hash: provenance });
      await run('open_appeal', [caseId, grounds]);
    } catch (error) { setMessage((error as Error).message); }
  }

  const card = (title: string, content: ReactNode) => <article className="card workflow-card"><div className="line"><h3>{title}</h3><span className="mono">{status}</span></div>{content}</article>;
  const action = (label: string, method: string, args: unknown[]) => <button className="button" disabled={busy || !account || !isTargetChain(chain)} onClick={() => void run(method, args)}>{label}</button>;

  return <div className="case-console">
    <div className="line"><span className="mono">LIVE CASE · {caseId}</span><div className="row"><span className="mono">{account ? account.slice(0, 10) + '…' : 'WALLET DISCONNECTED'}</span><button className="button alt" onClick={() => void wallet()}><Wallet size={14} /> Connect</button><button className="button alt" onClick={() => void refresh()} disabled={busy}><RefreshCw size={14} /> Refresh</button></div></div>
    {chain && !isTargetChain(chain) && <div className="warning">Writes are blocked on wallet chain {chain}. Switch to StudioNet {CHAIN_ID}.</div>}
      {surface === 'agreement' && <section className="route-grid">
      {card('Frozen agreement', <>{state ? <pre className="code">{JSON.stringify(state, null, 2)}</pre> : <p className="muted">No on-chain case was returned for this key.</p>}{status === 'DRAFT' && isProvider && action('Accept as provider', 'accept_agreement', [caseId])}{status === 'ACTIVE' && isRequester && action('Acknowledge delivery', 'acknowledge_delivery', [caseId])}{['ACTIVE', 'DELIVERED'].includes(status) && isParty && <div className="field"><label>Dispute reason digest</label><input value={fields.reason_hash || ''} onChange={(event) => change('reason_hash', event.target.value)} placeholder="64 lowercase hex characters" />{action('Open dispute', 'open_dispute', [caseId, fields.reason_hash || ''])}</div>}</>)}
      {card('Decision history', <><p className="muted">The current decision, revision number, deadlines, and actors are read directly from the contract. Each submitted write is stored with its explorer link after finality.</p>{decision && <pre className="code">{JSON.stringify(decision, null, 2)}</pre>}{history.length > 0 && <pre className="code">{JSON.stringify(history, null, 2)}</pre>}{receipt && <a className="button alt" href={receipt.explorer} target="_blank" rel="noreferrer">{receipt.successful ? 'Successful receipt' : 'Failed execution receipt'} <ExternalLink size={14} /></a>}</>)}
    </section>}
      {surface === 'evidence' && <section className="route-grid">
      {card('Issuer publication', <><Field label="Criterion ID" name="task_id" value={fields.task_id || taskIds[0] || ''} onChange={change} /><Field label="Attestation ID" name="attestation_id" value={fields.attestation_id || ''} onChange={change} placeholder="att-1" /><Field label="Immutable raw GitHub source URL" name="source" value={fields.source || ''} onChange={change} placeholder="https://raw.githubusercontent.com/owner/repo/commit/path" /><Field label="Full 40 character commit" name="source_revision" value={fields.source_revision || ''} onChange={change} /><Field label="Source content preview" name="content" value={fields.content || ''} onChange={change} multiline /><Field label="Claim" name="claim" value={fields.claim || ''} onChange={change} multiline />{isIssuer && <button className="button" disabled={busy || !account || !isTargetChain(chain)} onClick={() => void publish()}>Publish attestation</button>}</>)}
      {card('Independent source verification', <><Field label="Content SHA-256" name="digest" value={fields.digest || ''} onChange={change} placeholder="64 lowercase hex characters" /><Field label="Derived provenance commitment" name="provenance_hash" value={fields.provenance_hash || ''} onChange={change} placeholder="Publish computes this from the frozen coordinates" /><p className="muted small-copy">The verifier transaction causes validators to retrieve the raw commit, enforce a 2 KiB bound, compare the exact digest, and confirm the GitHub commit object.</p>{isVerifier && action('Verify source', 'verify_attestation_source', [caseId, fields.task_id || taskIds[0] || '', fields.attestation_id || '', fields.digest || '', fields.provenance_hash || ''])}</>)}
      {card('Evidence admission', <><p className="muted">After source verification, either party can bind the immutable attestation to the criterion. The nominated issuer then authenticates the exact digest.</p>{evidence && <pre className="code">{JSON.stringify(evidence, null, 2)}</pre>}{isParty && action('Submit evidence', 'submit_evidence', [caseId, fields.task_id || taskIds[0] || '', fields.attestation_id || ''])}{isIssuer && action('Authenticate evidence', 'authenticate_evidence', [caseId, fields.task_id || taskIds[0] || '', fields.digest || ''])}</>)}
    </section>}
      {surface === 'review' && <section className="route-grid">
      {card('Adjudication', <><p className="muted">Only a sealed dossier can be adjudicated. Validators receive the actual bounded source observations and return only PASS, FAIL, or INCONCLUSIVE labels.</p>{['DELIVERED', 'REVIEW'].includes(status) && isParty && action('Seal evidence', 'seal_agreement', [caseId])}{status === 'SEALED' && action('Run adjudication', 'adjudicate', [caseId])}{status === 'REVIEW' && action('Finalize missing evidence as inconclusive', 'finalize_inconclusive', [caseId])}</>)}
      {card('Structured appeal', <><Field label="Criterion ID" name="task_id" value={fields.task_id || taskIds[0] || ''} onChange={change} /><Field label="Challenged decision version" name="challenged_version" value={fields.challenged_version || String(decision?.version || 1)} onChange={change} /><Field label="New immutable raw GitHub source" name="source" value={fields.source || ''} onChange={change} /><Field label="New source revision" name="source_revision" value={fields.source_revision || ''} onChange={change} /><Field label="New source content preview" name="content" value={fields.content || ''} onChange={change} multiline /><Field label="Grounds and claim" name="basis" value={fields.basis || ''} onChange={change} multiline /><Field label="Claim" name="claim" value={fields.claim || ''} onChange={change} multiline />{status === 'APPEAL_WINDOW' && isParty && <button className="button" disabled={busy || !account || !isTargetChain(chain)} onClick={() => void openAppeal()}>Open appeal with verified content</button>}{status === 'APPEALED' && state?.appeal_authenticated !== true && isVerifier && action('Authenticate appeal source', 'authenticate_appeal', [caseId, fields.digest || '', fields.provenance_hash || ''])}{status === 'APPEALED' && state?.appeal_authenticated === true && action('Resolve appeal', 'resolve_appeal', [caseId])}{status === 'APPEAL_WINDOW' && action('Finalize after appeal deadline', 'finalize_decision', [caseId])}</>)}
      {card('Current decision', <>{decision ? <pre className="code">{JSON.stringify(decision, null, 2)}</pre> : <p className="muted">No decision has been recorded.</p>}{state?.decision_version && <p className="mono">VERSION {String(state.decision_version)} · {String(state.result || 'PENDING')}</p>}</>)}
    </section>}
    {surface === 'settlement' && <section className="route-grid">{card('Allocation record', <>{settlement && <pre className="code">{JSON.stringify(settlement, null, 2)}</pre>}<p className="muted">Native GEN custody is disabled. Allocation arithmetic is recorded only; no transfer is claimed.</p></>)}{card('Conservation readback', <>{accounting ? <pre className="code">{JSON.stringify(accounting, null, 2)}</pre> : <p className="muted">No accounting record returned.</p>}<a className="button alt" href={`${EXPLORER}/address/${CONTRACT}`} target="_blank" rel="noreferrer">Open contract explorer <ExternalLink size={14} /></a></>)}</section>}
    {message && <p className="notice"><CircleAlert size={14} />{message}</p>}
    {receipt && <div className={receipt.successful ? 'success' : 'warning'}><strong>{receipt.successful ? 'FINALIZED · FINISHED_WITH_RETURN' : `FINALIZED · ${receipt.execution || 'UNDETERMINED'}`}</strong> · <a href={receipt.explorer} target="_blank" rel="noreferrer">inspect explorer receipt</a></div>}
  </div>;
}
