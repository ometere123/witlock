import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExecutionResult, TransactionStatus } from 'genlayer-js/types';

const mocks = vi.hoisted(() => {
  process.env.NEXT_PUBLIC_WITLOCK_CONTRACT = '0x8d90aE2C95E320Ea61774a797D92ef84F6831bC2';
  return {
    provider: vi.fn(),
    readClient: vi.fn(),
    writeClient: vi.fn(),
  };
});

vi.mock('./network', async () => {
  const actual = await vi.importActual<typeof import('./network')>('./network');
  return { ...actual, ...mocks };
});

import {
  isSuccessfulFinalizedReceipt,
  readPendingTransaction,
  readPendingTransactions,
  recoverPendingTransactions,
  submitWrite,
} from './transactions';

const values = new Map<string, string>();

function successfulReceipt() {
  return { raw_error: null, error_code: null, error_description: null };
}

function quorumCancellationReceipt() {
  return {
    raw_error: { fatal: false, causes: ['VALIDATOR_QUORUM_REACHED'] },
    error_code: 'CONSENSUS_VALIDATOR_QUORUM_REACHED',
  };
}

function majorityConsensus() {
  return {
    validators: [
      { mode: 'validator', vote: 'agree', execution_result: 'SUCCESS', genvm_result: successfulReceipt() },
      { mode: 'validator', vote: 'agree', execution_result: 'SUCCESS', genvm_result: successfulReceipt() },
      { mode: 'validator', vote: 'idle', execution_result: 'ERROR', genvm_result: quorumCancellationReceipt() },
    ],
    leader_receipt: [
      { mode: 'leader', execution_result: 'SUCCESS', genvm_result: successfulReceipt() },
      { mode: 'validator', vote: 'idle', execution_result: 'ERROR', genvm_result: quorumCancellationReceipt() },
    ],
  };
}

beforeEach(() => {
  values.clear();
  mocks.provider.mockReset();
  mocks.readClient.mockReset();
  mocks.writeClient.mockReset();
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

  it('accepts the GenLayer JS simplified numeric execution field', () => {
    expect(isSuccessfulFinalizedReceipt({
      status_name: TransactionStatus.FINALIZED,
      result_name: 'MAJORITY_AGREE',
      tx_execution_result: 1,
      consensus_data: majorityConsensus(),
    })).toBe(true);
  });

  it('accepts a successful StudioNet receipt with quorum cancellation records', () => {
    expect(isSuccessfulFinalizedReceipt({
      status_name: TransactionStatus.FINALIZED,
      result_name: 'MAJORITY_AGREE',
      consensus_data: {
        validators: [
          { mode: 'validator', vote: 'agree', execution_result: 'SUCCESS', genvm_result: { raw_error: null, error_code: null, error_description: null } },
          { mode: 'validator', vote: 'agree', execution_result: 'SUCCESS', genvm_result: { raw_error: null, error_code: null, error_description: null } },
          { mode: 'validator', vote: 'agree', execution_result: 'SUCCESS', genvm_result: { raw_error: null, error_code: null, error_description: null } },
          { mode: 'validator', vote: 'idle', execution_result: 'ERROR', genvm_result: { raw_error: { fatal: false, causes: ['VALIDATOR_QUORUM_REACHED'] }, error_code: 'CONSENSUS_VALIDATOR_QUORUM_REACHED' } },
        ],
        leader_receipt: [
          { mode: 'leader', execution_result: 'SUCCESS', genvm_result: { raw_error: null, error_code: null, error_description: null } },
          { mode: 'validator', vote: 'idle', execution_result: 'ERROR', genvm_result: { raw_error: { fatal: false, causes: ['VALIDATOR_QUORUM_REACHED'] }, error_code: 'CONSENSUS_VALIDATOR_QUORUM_REACHED' } },
        ],
      },
    })).toBe(true);
  });

  it('accepts SDK success only when accompanying consensus metadata agrees', () => {
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      txExecutionResultName: ExecutionResult.FINISHED_WITH_RETURN,
      result_name: 'MAJORITY_AGREE',
      consensus_data: majorityConsensus(),
    })).toBe(true);
  });

  it('rejects NO_MAJORITY and unknown execution states', () => {
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      result_name: 'NO_MAJORITY',
      consensus_data: { validators: [], leader_receipt: [] },
    })).toBe(false);
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      result_name: 'MAJORITY_AGREE',
      consensus_data: {
        validators: [{ mode: 'validator', vote: 'agree', execution_result: 'PENDING', genvm_result: {} }],
        leader_receipt: [{ mode: 'leader', execution_result: 'SUCCESS', genvm_result: {} }],
      },
    })).toBe(false);
  });

  it('never lets an explicit execution error become success through majority agreement', () => {
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      txExecutionResultName: ExecutionResult.FINISHED_WITH_ERROR,
      result_name: 'MAJORITY_AGREE',
      consensus_data: {
        validators: [{ mode: 'validator', vote: 'agree', execution_result: 'SUCCESS', genvm_result: { raw_error: null, error_code: null, error_description: null } }],
        leader_receipt: [{ mode: 'leader', execution_result: 'SUCCESS', genvm_result: { raw_error: null, error_code: null, error_description: null } }],
      },
    })).toBe(false);
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      result_name: 'MAJORITY_AGREE',
      consensus_data: {
        validators: [{ mode: 'validator', vote: 'agree', execution_result: 'ERROR', genvm_result: { raw_error: 'execution failed', error_code: 'GENVM_ERROR' } }],
        leader_receipt: [{ mode: 'leader', execution_result: 'SUCCESS', genvm_result: { raw_error: null, error_code: null, error_description: null } }],
      },
    })).toBe(false);
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      txExecutionResultName: ExecutionResult.FINISHED_WITH_RETURN,
      result_name: 'MAJORITY_AGREE',
      consensus_data: {
        validators: [{ mode: 'validator', vote: 'agree', execution_result: 'SUCCESS', genvm_result: successfulReceipt() }],
        leader_receipt: [{ mode: 'leader', execution_result: 'ERROR', genvm_result: quorumCancellationReceipt() }],
      },
    })).toBe(false);
  });

  it('rejects contradictory top-level execution, result, and status aliases', () => {
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      txExecutionResultName: ExecutionResult.FINISHED_WITH_RETURN,
      execution_result: 'ERROR',
      result_name: 'MAJORITY_AGREE',
      consensus_data: majorityConsensus(),
    })).toBe(false);
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      status_name: TransactionStatus.CANCELED,
      txExecutionResultName: ExecutionResult.FINISHED_WITH_RETURN,
    })).toBe(false);
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      result_name: 'MAJORITY_AGREE',
      consensus_result: 'NO_MAJORITY',
      consensus_data: majorityConsensus(),
    })).toBe(false);
    expect(isSuccessfulFinalizedReceipt({
      status_name: TransactionStatus.FINALIZED,
      tx_execution_result: 1,
      tx_execution_result_name: ExecutionResult.FINISHED_WITH_ERROR,
      result_name: 'MAJORITY_AGREE',
      consensus_data: majorityConsensus(),
    })).toBe(false);
  });

  it('rejects NO_MAJORITY even when an SDK return enum is present', () => {
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      txExecutionResultName: ExecutionResult.FINISHED_WITH_RETURN,
      result_name: 'NO_MAJORITY',
      consensus_data: { validators: [], leader_receipt: [] },
    })).toBe(false);
  });

  it('rejects inconsistent validator results and malformed consensus records', () => {
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      result_name: 'MAJORITY_AGREE',
      consensus_data: {
        validators: [
          { mode: 'validator', vote: 'agree', execution_result: 'ERROR', genvm_result: { raw_error: { fatal: true }, error_code: 'GENVM_ERROR' } },
        ],
        leader_receipt: [{ mode: 'leader', execution_result: 'SUCCESS', genvm_result: successfulReceipt() }],
      },
    })).toBe(false);
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      result_name: 'MAJORITY_AGREE',
      consensus_data: { validators: [{ mode: 'validator', vote: 'agree' }] },
    })).toBe(false);
    expect(isSuccessfulFinalizedReceipt({
      statusName: TransactionStatus.FINALIZED,
      result_name: 'MAJORITY_AGREE',
      consensus_data: {
        validators: [{ mode: 'validator', vote: 'agree', execution_result: 'SUCCESS', genvm_result: successfulReceipt() }],
        leader_receipt: [{ mode: 'leader', execution_result: 'SUCCESS', genvm_result: successfulReceipt() }],
        final: false,
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

  it('recovers a pending transaction and clears it after successful finality', async () => {
    values.set('witlock.pending.transactions.v2', JSON.stringify([
      { hash: '0xabc', method: 'create_agreement', account: '0x1', chainId: 61999, contract: '0x8d90aE2C95E320Ea61774a797D92ef84F6831bC2', submittedAt: 1 },
    ]));
    const waitForTransactionReceipt = vi.fn().mockResolvedValue({
      status_name: TransactionStatus.FINALIZED,
      tx_execution_result_name: ExecutionResult.FINISHED_WITH_RETURN,
    });
    mocks.readClient.mockReturnValue({ waitForTransactionReceipt });

    const recovered = await recoverPendingTransactions();

    expect(recovered).toHaveLength(1);
    expect(recovered[0].successful).toBe(true);
    expect(waitForTransactionReceipt).toHaveBeenCalledOnce();
    expect(readPendingTransactions()).toHaveLength(0);
  });

  it('surfaces wallet signing rejection without creating a pending entry', async () => {
    const account = '0x1111111111111111111111111111111111111111';
    const request = vi.fn(async ({ method }: { method: string }) => {
      if (method === 'eth_accounts') return [account];
      if (method === 'eth_chainId') return '0xF22F';
      return null;
    });
    mocks.provider.mockReturnValue({ request });
    mocks.writeClient.mockReturnValue({
      writeContract: vi.fn().mockRejectedValue(Object.assign(new Error('User rejected the request'), { code: 4001 })),
    });

    await expect(submitWrite(account, 'create_agreement', [])).rejects.toMatchObject({ code: 4001 });
    expect(readPendingTransactions()).toHaveLength(0);
  });

  it('passes native funding value and classifies a finalized funded refusal as refunded rejection', async () => {
    const account = '0x2222222222222222222222222222222222222222';
    const request = vi.fn(async ({ method }: { method: string }) => {
      if (method === 'eth_accounts') return [account];
      if (method === 'eth_chainId') return '0xF22F';
      return null;
    });
    const writeContract = vi.fn().mockResolvedValue('0xfeed');
    mocks.provider.mockReturnValue({ request });
    mocks.writeClient.mockReturnValue({ writeContract });
    mocks.readClient.mockReturnValue({
      waitForTransactionReceipt: vi.fn().mockResolvedValue({
        status_name: TransactionStatus.FINALIZED,
        tx_execution_result_name: ExecutionResult.FINISHED_WITH_RETURN,
        result_name: 'MAJORITY_AGREE',
        consensus_data: {
          validators: [
            { mode: 'validator', vote: 'agree', execution_result: 'SUCCESS', genvm_result: successfulReceipt() },
          ],
          leader_receipt: [
            {
              mode: 'leader',
              execution_result: 'SUCCESS',
              genvm_result: successfulReceipt(),
              result: { payload: { readable: 'REJECTED_FUNDED WL_FUNDING_REQUIRED' } },
            },
          ],
        },
      }),
    });

    const error = await submitWrite(account, 'fund_agreement', ['funded'], 100n).catch((value) => value);

    expect(writeContract).toHaveBeenCalledWith(expect.objectContaining({
      functionName: 'fund_agreement',
      value: 100n,
    }));
    expect(error).toMatchObject({
      name: 'TransactionExecutionError',
      transaction: { successful: false, outcome: 'REJECTED_REFUNDED' },
    });
  });
});

