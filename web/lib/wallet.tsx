'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { isTargetChain, provider, switchNetwork } from './network';

type WalletContextValue = {
  account: string;
  chain: string;
  wrongNetwork: boolean;
  message: string;
  refresh: () => Promise<void>;
  connect: () => Promise<void>;
  switchToTarget: () => Promise<void>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: PropsWithChildren) {
  const [account, setAccount] = useState('');
  const [chain, setChain] = useState('');
  const [message, setMessage] = useState('');

  const refresh = useCallback(async () => {
    const injected = provider();
    if (!injected) {
      setAccount('');
      setChain('');
      return;
    }
    try {
      const accounts = (await injected.request({ method: 'eth_accounts' })) as string[];
      const chainId = String(await injected.request({ method: 'eth_chainId' }));
      setAccount(accounts[0] || '');
      setChain(chainId);
    } catch {
      setAccount('');
      setChain('');
    }
  }, []);

  useEffect(() => {
    void refresh();
    const injected = provider();
    if (!injected) return;
    const onAccount = (accounts: unknown) => {
      const next = Array.isArray(accounts) ? String(accounts[0] || '') : '';
      setAccount(next);
      setMessage(next ? 'Wallet account changed; review the active actor before signing.' : 'Wallet disconnected from this interface.');
    };
    const onChain = (value: unknown) => {
      const next = String(value || '');
      setChain(next);
      setMessage(next && !isTargetChain(next) ? 'Wrong network: writes are blocked until StudioNet is selected.' : '');
    };
    const onDisconnect = () => {
      setAccount('');
      setChain('');
      setMessage('Wallet disconnected from the injected provider.');
    };
    injected.on?.('accountsChanged', onAccount);
    injected.on?.('chainChanged', onChain);
    injected.on?.('disconnect', onDisconnect);
    return () => {
      injected.removeListener?.('accountsChanged', onAccount);
      injected.removeListener?.('chainChanged', onChain);
      injected.removeListener?.('disconnect', onDisconnect);
    };
  }, [refresh]);

  const connect = useCallback(async () => {
    const injected = provider();
    if (!injected) {
      setMessage('Install an injected EIP-1193 wallet to sign WITLOCK actions.');
      return;
    }
    try {
      const currentChain = String(await injected.request({ method: 'eth_chainId' }));
      if (!isTargetChain(currentChain)) {
        await switchNetwork(injected);
      } else {
        await injected.request({ method: 'eth_requestAccounts' });
      }
      await refresh();
      setMessage('');
    } catch (error) {
      setMessage((error as Error).message);
    }
  }, [refresh]);

  const switchToTarget = useCallback(async () => {
    const injected = provider();
    if (!injected) {
      setMessage('Install an injected EIP-1193 wallet to switch networks.');
      return;
    }
    try {
      await switchNetwork(injected);
      await refresh();
      setMessage('');
    } catch (error) {
      setMessage((error as Error).message);
    }
  }, [refresh]);

  const disconnect = useCallback(() => {
    setAccount('');
    setChain('');
    setMessage('Wallet disconnected from this interface. Reconnect to resume signing.');
  }, []);

  const value = useMemo(() => ({
    account,
    chain,
    wrongNetwork: !!chain && !isTargetChain(chain),
    message,
    refresh,
    connect,
    switchToTarget,
    disconnect,
  }), [account, chain, message, refresh, connect, switchToTarget, disconnect]);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const value = useContext(WalletContext);
  if (!value) throw new Error('useWallet must be used inside WalletProvider.');
  return value;
}
