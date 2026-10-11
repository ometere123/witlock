export const CHAIN_ID=61999;
export const CHAIN_HEX='0xf22f';
export const RPC='https://studio.genlayer.com/api';
export const EXPLORER='https://explorer-studio.genlayer.com';
export const CONTRACT=process.env.NEXT_PUBLIC_WITLOCK_CONTRACT||'';
export interface InjectedProvider{request(args:{method:string;params?:unknown[]}):Promise<unknown>;on?(event:string,fn:(value:unknown)=>void):void;removeListener?(event:string,fn:(value:unknown)=>void):void}
export function provider():InjectedProvider|undefined {return typeof window==='undefined'?undefined:(window as Window&{ethereum?:InjectedProvider}).ethereum}
export async function switchNetwork(p:InjectedProvider) {
  try{await p.request({method:'wallet_switchEthereumChain',params:[{chainId:CHAIN_HEX}]})}
  catch(e){if((e as {code?:number}).code!==4902)throw e;await p.request({method:'wallet_addEthereumChain',params:[{chainId:CHAIN_HEX,chainName:'GenLayer StudioNet',nativeCurrency:{name:'GEN',symbol:'GEN',decimals:18},rpcUrls:[RPC],blockExplorerUrls:[EXPLORER]}]})}
}
