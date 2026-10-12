import type { Address } from 'viem';
import type { Hash, TransactionStatus } from 'genlayer-js/types';
import { CHAIN_HEX, CONTRACT, EXPLORER, PENDING_TRANSACTION_KEY, provider, readClient, writeClient, isTargetChain } from './network';

export type PendingTransaction = {
  hash: `0x${string}`;
  method: string;
  account: string;
  submittedAt: number;
};

export type FinalizedTransaction = {
  hash: `0x${string}`;
  method?: string;
  status: string;
  execution: string;
  explorer: string;
  receipt: Record<string, unknown>;
};

function receiptField(receipt: Record<string, unknown>, camel: string, snake: string): string {
  return String(receipt[camel] ?? receipt[snake] ?? '');
}

export function explorerTransaction(hash: string): string {
  return `${EXPLORER}/tx/${hash}`;
}

export function readPendingTransaction(): PendingTransaction | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = JSON.parse(window.localStorage.getItem(PENDING_TRANSACTION_KEY) || 'null') as PendingTransaction | null;
    return value?.hash && value?.account ? value : null;
  } catch {
    return null;
  }
}

function savePendingTransaction(value: PendingTransaction): void {
  window.localStorage.setItem(PENDING_TRANSACTION_KEY, JSON.stringify(value));
}

function clearPendingTransaction(hash?: string): void {
  const current = readPendingTransaction();
  if (!hash || current?.hash === hash) window.localStorage.removeItem(PENDING_TRANSACTION_KEY);
}

async function assertWallet(account: string): Promise<void> {
  const injected = provider();
  if (!injected) throw new Error('An injected EIP-1193 wallet is required.');
  const accounts = (await injected.request({ method: 'eth_accounts' })) as string[];
  if (!accounts.some((value) => value.toLowerCase() === account.toLowerCase())) {
    throw new Error('The connected wallet account changed. Reconnect before signing.');
  }
  const chainId = String(await injected.request({ method: 'eth_chainId' }));
  if (!isTargetChain(chainId)) throw new Error(`Wrong network: switch the wallet to StudioNet ${CHAIN_HEX}.`);
}

export async function waitForFinalizedTransaction(hash: `0x${string}`, method?: string): Promise<FinalizedTransaction> {
  const receipt = await readClient().waitForTransactionReceipt({
    hash: hash as unknown as Hash,
    status: 'FINALIZED' as unknown as TransactionStatus,
    interval: 4000,
    retries: 180,
  });
  const record = receipt as unknown as Record<string, unknown>;
  const status = receiptField(record, 'statusName', 'status_name');
  const execution = receiptField(record, 'txExecutionResultName', 'execution_result');
  const result: FinalizedTransaction = {
    hash,
    method,
    status,
    execution,
    explorer: explorerTransaction(hash),
    receipt: record,
  };
  clearPendingTransaction(hash);
  if (status !== 'FINALIZED' || execution !== 'SUCCESS') {
    throw new Error(`Transaction ${hash} finalized with status ${status || 'UNKNOWN'} and execution ${execution || 'UNKNOWN'}.`);
  }
  return result;
}

export async function submitWrite(
  account: string,
  method: string,
  args: unknown[],
): Promise<FinalizedTransaction> {
  if (!CONTRACT) throw new Error('NEXT_PUBLIC_WITLOCK_CONTRACT is not configured.');
  await assertWallet(account);
  const injected = provider();
  if (!injected) throw new Error('An injected EIP-1193 wallet is required.');
  const client = writeClient(account, injected);
  const hash = String(await client.writeContract({
    address: CONTRACT as Address,
    functionName: method,
    args: args as never[],
    value: 0n,
  })) as `0x${string}`;
  savePendingTransaction({ hash, method, account, submittedAt: Date.now() });
  return waitForFinalizedTransaction(hash, method);
}

export async function recoverPendingTransaction(): Promise<FinalizedTransaction | null> {
  const pending = readPendingTransaction();
  if (!pending) return null;
  try {
    return await waitForFinalizedTransaction(pending.hash, pending.method);
  } catch (error) {
    if (String(error).includes('FINALIZED')) clearPendingTransaction(pending.hash);
    throw error;
  }
}
