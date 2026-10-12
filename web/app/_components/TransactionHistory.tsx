'use client';

import { ExternalLink, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { recoverPendingTransactions, readPendingTransactions, readTransactionHistory, type FinalizedTransaction, type PendingTransaction } from '@/lib/transactions';

function date(value: number): string {
  return new Date(value).toLocaleString();
}

export default function TransactionHistory() {
  const [pending, setPending] = useState<PendingTransaction[]>([]);
  const [history, setHistory] = useState<FinalizedTransaction[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  function refresh() {
    setPending(readPendingTransactions());
    setHistory(readTransactionHistory());
  }

  useEffect(() => { refresh(); }, []);

  async function recover() {
    setBusy(true);
    setMessage('Checking persisted transactions for finalized receipts…');
    try {
      const recovered = await recoverPendingTransactions();
      refresh();
      setMessage(recovered.length ? `${recovered.length} receipt${recovered.length === 1 ? '' : 's'} recovered.` : 'No persisted transaction is ready for recovery.');
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return <section className="activity-grid">
    <article className="route-card">
      <div className="line"><div><div className="label">PERSISTED SUBMISSIONS</div><h2>Pending transactions</h2></div><button className="button alt" onClick={() => void recover()} disabled={busy}><RefreshCw size={14} />{busy ? 'Checking…' : 'Recover'}</button></div>
      <p className="muted small-copy">Pending hashes are kept separately by wallet, chain, contract, and transaction hash so a refresh cannot hide another write.</p>
      {pending.length === 0 ? <p className="empty-state">No pending transaction is stored in this browser.</p> : <div className="transaction-list">{pending.map((item) => <div className="transaction-item" key={item.hash}><div><strong>{item.method || 'Contract write'}</strong><p className="mono">{item.hash}</p></div><span className="status-value">PENDING</span><p className="small-copy muted">Submitted {date(item.submittedAt)}</p></div>)}</div>}
      {message && <p className="notice">{message}</p>}
    </article>
    <article className="route-card">
      <div className="line"><div><div className="label">FINALIZED RECEIPTS</div><h2>Transaction history</h2></div><button className="button alt" onClick={refresh}><RefreshCw size={14} />Refresh</button></div>
      <p className="muted small-copy">Receipts are read from this browser’s local recovery history. Each result keeps the SDK-shaped consensus and execution status.</p>
      {history.length === 0 ? <p className="empty-state">No finalized receipt has been saved here yet.</p> : <div className="transaction-list">{history.map((item) => <div className="transaction-item" key={item.hash}><div><strong>{item.method || 'Contract write'}</strong><p className="mono">{item.hash}</p></div><span className={`status-value ${item.successful ? 'status-ok' : ''}`}>{item.successful ? 'FINALIZED · FINISHED_WITH_RETURN' : `FINALIZED · ${item.execution || 'UNDETERMINED'}`}</span><p className="small-copy muted">{item.account || 'Unknown account'} · <a href={item.explorer} target="_blank" rel="noreferrer">Explorer <ExternalLink size={12} /></a></p></div>)}</div>}
    </article>
  </section>;
}
