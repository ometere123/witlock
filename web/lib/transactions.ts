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
  outcome?: 'SUCCESS' | 'REJECTED_REFUNDED' | 'EXECUTION_FAILED';
  explorer: string;
  receipt: Record<string, unknown>;
};

export class TransactionExecutionError extends Error {
  readonly transaction: FinalizedTransaction;

  constructor(transaction: FinalizedTransaction) {
    super(`Transaction ${transaction.hash} finalized with status ${transaction.status || 'UNKNOWN'}, execution ${transaction.execution || 'UNKNOWN'}, and outcome ${transaction.outcome || 'EXECUTION_FAILED'}.`);
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

type ReceiptField = { present: boolean; value: string; consistent: boolean };

function receiptField(receipt: Record<string, unknown>, ...names: string[]): string {
  return receiptFieldState(receipt, ...names).value;
}

function receiptFieldState(receipt: Record<string, unknown>, ...names: string[]): ReceiptField {
  const values = names
    .filter((name) => receipt[name] !== undefined && receipt[name] !== null)
    .map((name) => String(receipt[name]));
  return {
    present: values.length > 0,
    value: values[0] || '',
    consistent: values.every((value) => value === values[0]),
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function leaderReturnText(receipt: Record<string, unknown>): string {
  const consensus = asRecord(receipt.consensus_data);
  const leaders = consensus?.leader_receipt;
  const leader = Array.isArray(leaders) ? asRecord(leaders[0]) : null;
  const result = asRecord(leader?.result);
  const payload = asRecord(result?.payload);
  return String(payload?.readable || payload?.raw || result?.readable || result?.payload || '');
}

export function isRejectedFundedReceipt(receipt: Record<string, unknown>, method?: string): boolean {
  return method === 'fund_agreement' && leaderReturnText(receipt).includes('REJECTED_FUNDED');
}

function isQuorumCancellation(record: Record<string, unknown>): boolean {
  if (record.mode !== 'validator' || record.vote !== 'idle' || record.execution_result !== 'ERROR') return false;
  const genvmResult = asRecord(record.genvm_result);
  if (!genvmResult) return false;
  if (genvmResult.error_code !== 'CONSENSUS_VALIDATOR_QUORUM_REACHED') return false;
  const rawError = asRecord(genvmResult.raw_error);
  const causes = rawError?.causes;
  return rawError?.fatal === false && Array.isArray(causes) && causes.includes('VALIDATOR_QUORUM_REACHED');
}

function hasSuccessfulExecution(record: Record<string, unknown>): boolean {
  if (record.execution_result === 'ERROR') return isQuorumCancellation(record);
  if (record.execution_result !== 'SUCCESS') return false;
  const genvmResult = asRecord(record.genvm_result);
  if (!genvmResult) return false;
  return !genvmResult.raw_error && !genvmResult.error_code && !genvmResult.error_description;
}

function hasSuccessfulStudioConsensus(receipt: Record<string, unknown>): boolean {
  const resultState = receiptFieldState(receipt, 'resultName', 'result_name', 'consensusResult', 'consensus_result');
  if (!resultState.present || !resultState.consistent || resultState.value !== 'MAJORITY_AGREE') return false;

  const consensus = asRecord(receipt.consensus_data);
  if (!consensus) return false;
  if (consensus.final !== undefined && consensus.final !== true) return false;
  const validators = consensus.validators;
  const leaderReceipts = consensus.leader_receipt;
  if (!Array.isArray(validators) || validators.length === 0 || !Array.isArray(leaderReceipts) || leaderReceipts.length === 0) return false;

  const validatorRecords = validators.map(asRecord);
  const leaderRecords = leaderReceipts.map(asRecord);
  if (validatorRecords.some((record) => !record) || leaderRecords.some((record) => !record)) return false;
  const typedValidators = validatorRecords as Record<string, unknown>[];
  const typedLeaders = leaderRecords as Record<string, unknown>[];
  if (typedValidators.some((record) => record.mode !== 'validator' || !['agree', 'idle'].includes(String(record.vote)))) return false;
  if (typedLeaders.some((record) => record.mode !== 'leader' && record.mode !== 'validator')) return false;
  const records = [...typedLeaders, ...typedValidators];
  if (records.some((record) => !record)) return false;
  const leader = typedLeaders.find((record) => record.mode === 'leader');
  if (!leader || !hasSuccessfulExecution(leader)) return false;
  if (typedLeaders.some((record) => record.mode === 'leader' && !hasSuccessfulExecution(record))) return false;
  if (!typedValidators.some((record) => record.vote === 'agree' && hasSuccessfulExecution(record))) return false;
  if (!records.every(hasSuccessfulExecution)) return false;

  const votes = asRecord(consensus.votes);
  if (consensus.votes !== undefined && (!votes || Object.values(votes).some((vote) => !['agree', 'idle', 'AGREE', 'IDLE'].includes(String(vote))))) return false;
  if (votes && !Object.values(votes).some((vote) => String(vote).toUpperCase() === 'AGREE')) return false;

  const lastRound = asRecord(receipt.lastRound || receipt.last_round);
  if (receipt.lastRound !== undefined || receipt.last_round !== undefined) {
    if (!lastRound) return false;
    const validatorVotes = lastRound.validatorVotesName || lastRound.validator_votes_name;
    if (!Array.isArray(validatorVotes) || validatorVotes.length === 0) return false;
    if (validatorVotes.some((vote) => !['agree', 'idle', 'AGREE', 'IDLE'].includes(String(vote)))) return false;
    if (!validatorVotes.some((vote) => String(vote).toUpperCase() === 'AGREE')) return false;
    const numericVotes = lastRound.validatorVotes || lastRound.validator_votes;
    if (numericVotes !== undefined && (!Array.isArray(numericVotes) || numericVotes.length !== validatorVotes.length)) return false;
  }
  return true;
}

function executionResultState(receipt: Record<string, unknown>): ReceiptField {
  const state = receiptFieldState(
    receipt,
    'txExecutionResultName',
    'tx_execution_result_name',
    'executionResult',
    'execution_result',
  );
  const numeric = receiptFieldState(receipt, 'txExecutionResult', 'tx_execution_result');
  const normalize = (value: string): string => {
    if (value === '0') return 'NOT_VOTED';
    if (value === '1') return ExecutionResult.FINISHED_WITH_RETURN;
    if (value === '2') return ExecutionResult.FINISHED_WITH_ERROR;
    return value;
  };
  const values = [
    ...(state.present ? [normalize(state.value)] : []),
    ...(numeric.present ? [normalize(numeric.value)] : []),
  ];
  return {
    present: values.length > 0,
    value: values[0] || '',
    consistent: state.consistent && numeric.consistent && values.every((value) => value === values[0]),
  };
}

export function isSuccessfulFinalizedReceipt(receipt: Record<string, unknown>): boolean {
  const statusState = receiptFieldState(receipt, 'statusName', 'status_name');
  if (!statusState.present || !statusState.consistent || statusState.value !== TransactionStatus.FINALIZED) return false;

  const executionState = executionResultState(receipt);
  if (!executionState.consistent) return false;
  if (executionState.present && executionState.value !== ExecutionResult.FINISHED_WITH_RETURN) return false;

  const resultState = receiptFieldState(receipt, 'resultName', 'result_name', 'consensusResult', 'consensus_result');
  const hasConsensus = receipt.consensus_data !== undefined && receipt.consensus_data !== null;
  if (hasConsensus || resultState.present) {
    if (executionState.present && executionState.value !== ExecutionResult.FINISHED_WITH_RETURN) return false;
    return hasSuccessfulStudioConsensus(receipt);
  }

  // The SDK enum path is valid only when no partial consensus metadata is
  // supplied to contradict it. Unknown or absent execution is fail-closed.
  return executionState.value === ExecutionResult.FINISHED_WITH_RETURN;
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
  const receiptSuccessful = isSuccessfulFinalizedReceipt(record);
  const rejectedFunded = isRejectedFundedReceipt(record, method);
  const finalized: FinalizedTransaction = {
    hash,
    method,
    account,
    status,
    execution,
    successful: receiptSuccessful && !rejectedFunded,
    outcome: rejectedFunded ? 'REJECTED_REFUNDED' : receiptSuccessful ? 'SUCCESS' : 'EXECUTION_FAILED',
    explorer: explorerTransaction(hash),
    receipt: record,
  };
  if (account && CONTRACT) clearPendingTransaction({ hash, account, contract: CONTRACT });
  rememberFinalized(finalized);
  if (!finalized.successful) throw new TransactionExecutionError(finalized);
  return finalized;
}

export async function submitWrite(account: string, method: string, args: unknown[], value: bigint = 0n): Promise<FinalizedTransaction> {
  if (!CONTRACT) throw new Error('NEXT_PUBLIC_WITLOCK_CONTRACT is not configured.');
  await assertWallet(account);
  const injected = provider();
  if (!injected) throw new Error('An injected EIP-1193 wallet is required.');
  const client = writeClient(account, injected);
  const hash = String(await client.writeContract({
    address: CONTRACT as Address,
    functionName: method,
    args: args as never[],
    value,
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
