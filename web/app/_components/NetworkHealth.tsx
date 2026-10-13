'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, CircleAlert, RefreshCw, Wallet } from 'lucide-react';
import { CHAIN_ID, CONTRACT, EXPLORER, RPC, readClient } from '@/lib/network';
import { useWallet } from '@/lib/wallet';

function Status({ label, value, ok = false }: { label: string; value: string; ok?: boolean }) {
  return <div className="line"><span>{label}</span><span className={ok ? 'status-value status-ok' : 'status-value'}>{ok ? <CheckCircle2 size={14} /> : <CircleAlert size={14} />}{value}</span></div>;
}

export default function NetworkHealth() {
  const { account, chain, wrongNetwork, connect, switchToTarget } = useWallet();
  const [contractInfo, setContractInfo] = useState('');
  const [custody, setCustody] = useState<string>('UNKNOWN');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function refresh() {
    if (!CONTRACT) {
      setContractInfo('NOT CONFIGURED'); setCustody('NOT CONFIGURED');
      setMessage('No current-source contract address is configured.');
      return;
    }
    setBusy(true);
    try {
      const client = readClient();
      const [info, custodyEnabled] = await Promise.all([
        client.readContract({ address: CONTRACT as `0x${string}`, functionName: 'get_contract_info', args: [] }),
        client.readContract({ address: CONTRACT as `0x${string}`, functionName: 'custody_enabled', args: [] }),
      ]);
      setContractInfo(typeof info === 'string' ? info : JSON.stringify(info));
      setCustody(String(custodyEnabled));
      setMessage('Health read completed from StudioNet.');
    } catch (error) {
      setContractInfo('READ_FAILED'); setCustody('READ_FAILED'); setMessage((error as Error).message);
    } finally { setBusy(false); }
  }

  useEffect(() => { void refresh(); }, []);

  return <section className="route-grid health-grid">
    <article className="route-card"><div className="line"><h2>Approved network</h2><button className="button alt" onClick={() => void (wrongNetwork ? switchToTarget() : connect())}><Wallet size={14} />{account ? 'Wallet connected' : wrongNetwork ? 'Switch network' : 'Connect wallet'}</button></div><Status label="Chain" value={`GenLayer StudioNet · ${CHAIN_ID}`} ok /><Status label="RPC" value={RPC} ok /><Status label="Explorer" value={EXPLORER} ok /><Status label="Wallet chain" value={chain || 'NOT CONNECTED'} ok={!!chain && !wrongNetwork} /><Status label="Wallet account" value={account || 'NOT CONNECTED'} ok={!!account} /></article>
    <article className="route-card"><div className="line"><h2>Contract evidence</h2><button className="button alt" onClick={() => void refresh()} disabled={busy}><RefreshCw size={14} />Refresh</button></div><Status label="Current address" value={CONTRACT || 'NOT CONFIGURED'} ok={!!CONTRACT} /><Status label="Metadata read" value={contractInfo ? (contractInfo === 'NOT CONFIGURED' ? contractInfo : 'AVAILABLE') : 'PENDING'} ok={!!contractInfo && contractInfo !== 'READ_FAILED' && contractInfo !== 'NOT CONFIGURED'} /><Status label="Native custody" value={custody === 'false' ? 'DISABLED' : custody} ok={custody === 'false'} /><p className="muted small-copy">A configured RPC is not a deployed contract. Source parity and finalized execution must be independently recorded before this client enables writes.</p></article>
    {message && <p className="notice health-message">{message}</p>}
  </section>;
}
