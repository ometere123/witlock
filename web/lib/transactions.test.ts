import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExecutionResult, TransactionStatus } from 'genlayer-js/types';
import { isSuccessfulFinalizedReceipt, readPendingTransaction, readPendingTransactions } from './transactions';

const values = new Map<string, string>();

beforeEach(() => {
  values.clear();
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    },
  });
});

describe('GenLayer receipt classification', () => {
  it('accepts the SDK documented successful execution enum', () => {
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      txExecutionResultName: ExecutionResult.FINISHED_WITH_RETURN,
    })).toBe(true);
  });

  it('accepts the pinned StudioNet receipt shape with successful validator execution', () => {
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      result_name: 'MAJORITY_AGREE',
      consensus_data: {
        validators: [
          { vote: 'agree', execution_result: 'SUCCESS', genvm_result: { raw_error: null } },
          { vote: 'agree', execution_result: 'SUCCESS', genvm_result: { raw_error: null } },
        ],
      },
    })).toBe(true);
  });

  it('rejects finalized execution errors and generic SUCCESS labels', () => {
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      txExecutionResultName: ExecutionResult.FINISHED_WITH_ERROR,
    })).toBe(false);
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      execution_result: 'SUCCESS',
    })).toBe(false);
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      result_name: 'MAJORITY_AGREE',
      consensus_data: {
        validators: [
          { vote: 'agree', execution_result: 'ERROR', genvm_result: { raw_error: 'execution failed' } },
        ],
      },
    })).toBe(false);
  });
});

describe('pending transaction persistence', () => {
  it('keeps independent account/hash entries after refresh', () => {
    values.set('witlock.pending.transactions.v2', JSON.stringify([
      { hash: '0xaaa', method: 'create_agreement', account: '0x1', chainId: 61999, contract: '0xcontract', submittedAt: 1 },
      { hash: '0xbbb', method: 'accept_agreement', account: '0x2', chainId: 61999, contract: '0xcontract', submittedAt: 2 },
    ]));
    expect(readPendingTransactions()).toHaveLength(2);
    expect(readPendingTransaction()?.hash).toBe('0xaaa');
  });
});
