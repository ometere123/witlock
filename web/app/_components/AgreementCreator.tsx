'use client';

import { useMemo, useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { CHAIN_ID, CONTRACT } from '@/lib/network';
import { useWallet } from '@/lib/wallet';
import { submitWrite, TransactionExecutionError, type FinalizedTransaction } from '@/lib/transactions';

type Criterion = { id: string; question: string; weight: number; critical: boolean; issuer: string; verifier: string };

export default function AgreementCreator() {
  const { account, wrongNetwork, connect, switchToTarget } = useWallet();
  const [caseId, setCaseId] = useState('');
  const [providerAddress, setProviderAddress] = useState('');
  const [detailsHash, setDetailsHash] = useState('');
  const [acceptDeadline, setAcceptDeadline] = useState(() => Math.floor(Date.now() / 1000) + 86400);
  const [deliveryDeadline, setDeliveryDeadline] = useState(() => Math.floor(Date.now() / 1000) + 604800);
  const [appealDeadline, setAppealDeadline] = useState(() => Math.floor(Date.now() / 1000) + 691200);
  const [criteria, setCriteria] = useState<Criterion[]>([{ id: 'source', question: 'Does the independently verified source support the frozen acceptance criterion?', weight: 100, critical: true, issuer: '', verifier: '' }]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<FinalizedTransaction | null>(null);

  const totalWeight = useMemo(() => criteria.reduce((sum, item) => sum + Number(item.weight), 0), [criteria]);
  const ready = !!account && !!CONTRACT && !wrongNetwork;
  function changeCriterion(index: number, patch: Partial<Criterion>) { setCriteria((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item)); }

  async function create() {
    try {
      if (!ready) throw new Error(`Connect an injected wallet on StudioNet ${CHAIN_ID} with a verified contract configured.`);
      if (!/^[a-zA-Z0-9_-]{1,64}$/.test(caseId)) throw new Error('Case ID may contain only letters, numbers, underscores, or hyphens.');
      if (!/^0x[a-f\d]{40}$/i.test(providerAddress) || providerAddress.toLowerCase() === account.toLowerCase()) throw new Error('Provider must be a distinct wallet.');
      if (!/^[a-f\d]{64}$/.test(detailsHash)) throw new Error('Use a 64-character lowercase agreement SHA-256 commitment.');
      if (totalWeight !== 100) throw new Error('Criterion weights must total 100.');
      if (!(acceptDeadline < deliveryDeadline && deliveryDeadline < appealDeadline)) throw new Error('Deadlines must be strictly ordered.');
      for (const criterion of criteria) {
        if (!/^[a-zA-Z0-9_-]{1,20}$/.test(criterion.id) || criterion.question.length < 20 || criterion.question.length > 240) throw new Error('Each criterion needs a bounded ID and question.');
        if (!/^0x[a-f\d]{40}$/i.test(criterion.issuer) || !/^0x[a-f\d]{40}$/i.test(criterion.verifier)) throw new Error('Each criterion needs issuer and verifier wallets.');
        if ([account.toLowerCase(), providerAddress.toLowerCase()].includes(criterion.issuer.toLowerCase()) || [account.toLowerCase(), providerAddress.toLowerCase(), criterion.issuer.toLowerCase()].includes(criterion.verifier.toLowerCase())) throw new Error('Issuer and verifier must be independent of the parties and each other.');
      }
      setBusy(true); setReceipt(null); setMessage('Submitting creation; waiting for FINALIZED and FINISHED_WITH_RETURN…');
      const result = await submitWrite(account, 'create_agreement', [caseId, providerAddress, JSON.stringify({ tasks: criteria }), detailsHash, BigInt(acceptDeadline), BigInt(deliveryDeadline), BigInt(appealDeadline), 0n, 0n]);
      setReceipt(result); setMessage('Agreement created with successful GenVM execution.');
    } catch (error) {
      if (error instanceof TransactionExecutionError) { setReceipt(error.transaction); setMessage(`Finalized with execution ${error.transaction.execution || 'undetermined'}.`); }
      else setMessage((error as Error).message);
    } finally { setBusy(false); }
  }

  return <section className="panel creator"><div className="line"><div><div className="label">NONCUSTODIAL CREATION</div><h2>Freeze an agreement</h2></div><button className="button alt" onClick={() => void (wrongNetwork ? switchToTarget() : connect())}><Wallet size={14} />{account ? 'Wallet connected' : wrongNetwork ? 'Switch network' : 'Connect wallet'}</button></div><p className="muted">Creation writes a zero-value agreement. Funding and operator bonds are hard-disabled while native custody remains unproven.</p>{!CONTRACT && <div className="warning">No verified current-source contract address is configured, so submission is disabled.</div>}<div className="field"><label htmlFor="new-case-id">Case ID</label><input id="new-case-id" value={caseId} onChange={(event) => setCaseId(event.target.value)} placeholder="WL-2026-001" /></div><div className="field"><label htmlFor="new-provider">Provider wallet</label><input id="new-provider" value={providerAddress} onChange={(event) => setProviderAddress(event.target.value)} placeholder="0x…" /></div><div className="field"><label htmlFor="new-details-hash">Agreement SHA-256 commitment</label><input id="new-details-hash" value={detailsHash} onChange={(event) => setDetailsHash(event.target.value)} placeholder="64 lowercase hex characters" /></div><div className="grid"><div className="field"><label>Accept deadline · Unix seconds</label><input type="number" value={acceptDeadline} onChange={(event) => setAcceptDeadline(Number(event.target.value))} /></div><div className="field"><label>Delivery deadline · Unix seconds</label><input type="number" value={deliveryDeadline} onChange={(event) => setDeliveryDeadline(Number(event.target.value))} /></div><div className="field"><label>Appeal deadline · Unix seconds</label><input type="number" value={appealDeadline} onChange={(event) => setAppealDeadline(Number(event.target.value))} /></div></div><div className="line"><h3>Criteria · {totalWeight} / 100</h3><button className="button alt" disabled={criteria.length >= 2} onClick={() => setCriteria((current) => [...current, { id: '', question: '', weight: 0, critical: false, issuer: '', verifier: '' }])}><Plus size={14} /> Add criterion</button></div>{criteria.map((criterion, index) => <div className="card" key={`${criterion.id}-${index}`}><div className="line"><span>CRITERION {index + 1}</span>{criteria.length > 1 && <button className="button alt" onClick={() => setCriteria((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>}</div><div className="field"><label>ID</label><input value={criterion.id} onChange={(event) => changeCriterion(index, { id: event.target.value })} /></div><div className="field"><label>Question</label><textarea value={criterion.question} onChange={(event) => changeCriterion(index, { question: event.target.value })} /></div><div className="grid"><div className="field"><label>Weight</label><input type="number" min="1" max="100" value={criterion.weight} onChange={(event) => changeCriterion(index, { weight: Number(event.target.value) })} /></div><div className="field"><label>Nominated issuer</label><input value={criterion.issuer} onChange={(event) => changeCriterion(index, { issuer: event.target.value })} placeholder="0x…" /></div><div className="field"><label>Independent verifier</label><input value={criterion.verifier} onChange={(event) => changeCriterion(index, { verifier: event.target.value })} placeholder="0x…" /></div></div><label><input type="checkbox" checked={criterion.critical} onChange={(event) => changeCriterion(index, { critical: event.target.checked })} /> Critical criterion</label></div>)}<button className="button" onClick={() => void create()} disabled={busy || !ready}>{busy ? 'Waiting for finality…' : 'Submit agreement'}</button>{message && <p className="notice">{message}</p>}{receipt && <div className={receipt.successful ? 'success' : 'warning'}><strong>{receipt.successful ? 'FINALIZED · FINISHED_WITH_RETURN' : `FINALIZED · ${receipt.execution || 'UNDETERMINED'}`}</strong> · <a href={receipt.explorer} target="_blank" rel="noreferrer">Inspect receipt</a></div>}</section>;
}
