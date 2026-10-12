import { readFileSync } from 'node:fs';

const expected = {
  chainId: 61999,
  rpc: 'https://studio.genlayer.com/api',
};

const source = readFileSync(new URL('../web/lib/network.ts', import.meta.url), 'utf8');
if (!source.includes(`CHAIN_ID = ${expected.chainId}`)) {
  throw new Error(`Refusing preflight: expected chain ${expected.chainId}`);
}
if (!source.includes(`'${expected.rpc}'`)) {
  throw new Error(`Refusing preflight: expected RPC ${expected.rpc}`);
}
if (source.includes('61997') || source.includes('development-preview') || source.includes('next-release')) {
  throw new Error('Refusing preflight: disallowed network configuration found');
}
console.log(`WITLOCK preflight configuration: StudioNet ${expected.chainId} at ${expected.rpc}`);
