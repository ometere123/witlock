import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import type { Address, EIP1193Provider } from 'viem';

export const CHAIN_ID = 61999;
export const CHAIN_HEX = '0xF22F';
export const RPC = 'https://studio.genlayer.com/api';
export const EXPLORER = 'https://explorer-studio.genlayer.com';
export const CONTRACT = process.env.NEXT_PUBLIC_WITLOCK_CONTRACT || '';
export const REGISTRY = process.env.NEXT_PUBLIC_WITLOCK_REGISTRY || '';

export type InjectedProvider = EIP1193Provider & {
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
};

export function provider(): InjectedProvider | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as Window & { ethereum?: InjectedProvider }).ethereum;
}

export function readClient() {
  return createClient({ chain: studionet });
}

export function writeClient(address: string, injected: InjectedProvider) {
  return createClient({
    chain: studionet,
    account: address as Address,
    provider: injected,
  });
}

export async function switchNetwork(injected: InjectedProvider) {
  try {
    await injected.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_HEX }] });
  } catch (error) {
    if ((error as { code?: number }).code !== 4902) throw error;
    await injected.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: CHAIN_HEX,
        chainName: 'GenLayer StudioNet',
        nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
        rpcUrls: [RPC],
        blockExplorerUrls: [EXPLORER],
      }],
    });
  }
}

export function explorerTransaction(hash: string) {
  return `${EXPLORER}/tx/${hash}`;
}
