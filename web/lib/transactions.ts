import type { Address } from 'viem';
import { ExecutionResult, TransactionStatus, type Hash } from 'genlayer-js/types';
import { CHAIN_ID, CHAIN_HEX, CONTRACT, EXPLORER, provider, readClient, writeClient, isTargetChain } from './network';

export type PendingTransaction = {
  hash: `0x${string}`;
  method: string;
  account: string;
  chainId: number;
  contract: string;
  submittedAt: number;
};

export type FinalizedTransaction = {
  hash: `0x${string}`;
  method?: string;
  account?: string;
  status: string;
  execution: string;
  successful: boolean;
  explorer: string;
  receipt: Record<string, unknown>;
};

export class TransactionExecutionError extends Error {
  readonly transaction: FinalizedTransaction;

  constructor(transaction: FinalizedTransaction) {
    super(`Transaction ${transaction.hash} finalized with status ${transaction.status || 'UNKNOWN'} and execution ${transaction.execution || 'UNKNOWN'}.`);
    this.name = 'TransactionExecutionError';
    this.transaction = transaction;
  }
}

const PENDING_KEY = 'witlock.pending.transactions.v2';
const HISTORY_KEY = 'witlock.transaction.history.v1';

function parseArray<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value as T[] : [];
  } catch {
    return [];
  }
}

function transactionKey(value: Pick<PendingTransaction, 'hash' | 'account' | 'contract'>): string {
  return `${value.account.toLowerCase()}|${CHAIN_ID}|${value.contract.toLowerCase()}|${value.hash.toLowerCase()}`;
}

function rememberFinalized(transaction: FinalizedTransaction): void {
  const history = parseArray<FinalizedTransaction>(HISTORY_KEY).filter((item) => item.hash !== transaction.hash);
  history.unshift(transaction);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
}

export function explorerTransaction(hash: string): string {
  return `${EXPLORER}/tx/${hash}`;
}

export function readPendingTransactions(): PendingTransaction[] {
  const current = parseArray<PendingTransaction>(PENDING_KEY).filter(
    (item) => item?.hash && item?.account && item?.contract,
  );
  if (current.length) return current;
  if (typeof window === 'undefined') return [];
  try {
    const legacy = JSON.parse(window.localStorage.getItem('witlock.pending.transaction.v1') || 'null') as PendingTransaction | null;
    return legacy?.hash && legacy.account
      ? [{ ...legacy, chainId: CHAIN_ID, contract: CONTRACT }]
      : [];
  } catch {
    return [];
  }
}

export function readPendingTransaction(): PendingTransaction | null {
  return readPendingTransactions()[0] || null;
}

export function readTransactionHistory(): FinalizedTransaction[] {
  return parseArray<FinalizedTransaction>(HISTORY_KEY);
}

function savePendingTransaction(value: PendingTransaction): void {
  const values = readPendingTransactions().filter((item) => transactionKey(item) !== transactionKey(value));
  values.push(value);
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(values));
}

function clearPendingTransaction(value: Pick<PendingTransaction, 'hash' | 'account' | 'contract'>): void {
  const values = readPendingTransactions().filter((item) => transactionKey(item) !== transactionKey(value));
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(values));
  window.localStorage.removeItem('witlock.pending.transaction.v1');
}

function receiptField(receipt: Record<string, unknown>, ...names: string[]): string {
  for (const name of names) {
    if (receipt[name] !== undefined && receipt[name] !== null) return String(receipt[name]);
  }
  return '';
}

function hasSuccessfulStudioConsensus(receipt: Record<string, unknown>): boolean {
  const resultName = receiptField(receipt, 'resultName', 'result_name');
  if (resultName !== 'MAJORITY_AGREE') return false;

  const consensus = receipt.consensus_data;
  if (!consensus || typeof consensus !== 'object') return false;
  const validators = (consensus as { validators?: unknown }).validators;
  if (!Array.isArray(validators) || validators.length === 0) return false;

  return validators.every((validator) => {
    if (!validator || typeof validator !== 'object') return false;
    const record = validator as { execution_result?: unknown; genvm_result?: unknown };
    if (record.execution_result !== 'SUCCESS') return false;
    if (!record.genvm_result || typeof record.genvm_result !== 'object') return true;
    const genvmResult = record.genvm_result as Record<string, unknown>;
    return !genvmResult.raw_error && !genvmResult.error_code && !genvmResult.error_description;
  });
}

export function isSuccessfulFinalizedReceipt(receipt: Record<string, unknown>): boolean {
  const status = receiptField(receipt, 'statusName', 'status_name');
  const execution = receiptField(receipt, 'txExecutionResultName', 'tx_execution_result_name');
  if (status !== TransactionStatus.FINALIZED) return false;
  return execution === ExecutionResult.FINISHED_WITH_RETURN || hasSuccessfulStudioConsensus(receipt);
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

export async function waitForFinalizedTransaction(
  hash: `0x${string}`,
  method?: string,
  account?: string,
): Promise<FinalizedTransaction> {
  const receipt = await readClient().waitForTransactionReceipt({
    hash: hash as unknown as Hash,
    status: TransactionStatus.FINALIZED,
    interval: 4000,
    retries: 180,
  });
  const record = receipt as unknown as Record<string, unknown>;
  const status = receiptField(record, 'statusName', 'status_name');
  const execution = receiptField(record, 'txExecutionResultName', 'tx_execution_result_name');
  const finalized: FinalizedTransaction = {
    hash,
    method,
    account,
    status,
    execution,
    successful: isSuccessfulFinalizedReceipt(record),
    explorer: explorerTransaction(hash),
    receipt: record,
  };
  if (account && CONTRACT) clearPendingTransaction({ hash, account, contract: CONTRACT });
  rememberFinalized(finalized);
  if (!finalized.successful) throw new TransactionExecutionError(finalized);
  return finalized;
}

export async function submitWrite(account: string, method: string, args: unknown[]): Promise<FinalizedTransaction> {
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
  savePendingTransaction({ hash, method, account, chainId: CHAIN_ID, contract: CONTRACT, submittedAt: Date.now() });
  return waitForFinalizedTransaction(hash, method, account);
}

export async function recoverPendingTransactions(): Promise<FinalizedTransaction[]> {
  const recovered: FinalizedTransaction[] = [];
  for (const transaction of readPendingTransactions()) {
    try {
      recovered.push(await waitForFinalizedTransaction(transaction.hash, transaction.method, transaction.account));
    } catch (error) {
      if (error instanceof TransactionExecutionError) recovered.push(error.transaction);
    }
  }
  return recovered;
}

export async function recoverPendingTransaction(): Promise<FinalizedTransaction | null> {
  return (await recoverPendingTransactions())[0] || null;
}
