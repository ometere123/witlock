'use client';

import { Menu, Wallet, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CHAIN_ID, isTargetChain, provider, switchNetwork } from '@/lib/network';

const NAV_LINKS = [
  { href: '/explore', label: 'Explore' },
  { href: '/new', label: 'New agreement' },
  { href: '/workspace', label: 'Workspace' },
  { href: '/activity', label: 'Activity' },
  { href: '/verification', label: 'Verify' },
  { href: '/guide', label: 'Guide' },
];

function short(value: string): string {
  return value.length > 18 ? `${value.slice(0, 8)}…${value.slice(-6)}` : value;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState('');
  const [chain, setChain] = useState('');
  const [message, setMessage] = useState('');

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
    const injected = provider();
    if (!injected) return;
    const onAccount = () => void refreshWallet();
    const onChain = () => void refreshWallet();
    injected.on?.('accountsChanged', onAccount);
    injected.on?.('chainChanged', onChain);
    return () => {
      injected.removeListener?.('accountsChanged', onAccount);
      injected.removeListener?.('chainChanged', onChain);
    };
  }, []);

  async function walletAction() {
    const injected = provider();
    if (!injected) {
      setMessage('Install an injected EIP-1193 wallet to sign WITLOCK actions.');
      return;
    }
    try {
      if (chain && !isTargetChain(chain)) {
        await switchNetwork(injected);
      } else if (!account) {
        await injected.request({ method: 'eth_requestAccounts' });
      }
      setMessage('');
      await refreshWallet();
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  function disconnect() {
    setAccount('');
    setChain('');
    setMessage('Wallet disconnected from this interface.');
  }

  const wrongNetwork = !!chain && !isTargetChain(chain);

  return <div className="site-shell">
    <header className="site-header">
      <div className="site-nav wrap">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>WIT<span>LOCK</span></Link>
        <nav className={`site-links ${open ? 'site-links-open' : ''}`} aria-label="Primary navigation">
          {NAV_LINKS.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href || pathname.startsWith(`${link.href}/`) ? 'active' : ''} onClick={() => setOpen(false)}>{link.label}</Link>)}
        </nav>
        <div className="site-actions">
          <span className={`network-chip ${wrongNetwork ? 'network-chip-wrong' : ''}`}>{wrongNetwork ? 'WRONG NETWORK' : `STUDIONET · ${CHAIN_ID}`}</span>
          <button className="button alt wallet-button" onClick={() => void walletAction()}><Wallet size={14} />{wrongNetwork ? 'Switch network' : account ? short(account) : 'Connect wallet'}</button>
          {account && <button className="button alt wallet-disconnect" onClick={disconnect}>Disconnect</button>}
          <button className="button alt menu-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X size={17} /> : <Menu size={17} />}</button>
        </div>
      </div>
      {message && <div className="shell-notice wrap" role="status">{message}</div>}
    </header>
    {children}
    <footer className="site-footer wrap"><span>WITLOCK · provenance before economic finality</span><span>INJECTED WALLET ONLY · CUSTODY DISABLED</span></footer>
  </div>;
}
