import { BehaviorSubject, Subject } from "rxjs";
import type { PublicClient, WalletClient, Chain, Abi } from "viem";
import type { CacheStore } from "../workers";
import { TableId } from "@latticexyz/utils";
import { StoreEvent, EphemeralEvent } from "../v2/common";
import { IWorldKernel__factory } from "@latticexyz/world/types/ethers-contracts/factories/IWorldKernel.sol/IWorldKernel__factory";

// TODO: connection status?
// TODO: sync status (rpc vs mode vs cache)

export const storeEvent$ = new Subject<{
  chainId: number;
  worldAddress: string;
  transactionHash: string;
  blockNumber: number;
  logIndex: number;
  event: StoreEvent | EphemeralEvent;
  table: TableId;
  keyTuple: any; // TODO: refine
  indexedValues?: Record<number, any>; // TODO: refine
  namedValues?: Record<string, any>; // TODO: refine
}>();

export const transactionHash$ = new Subject<string>();

// require chain for now so we can use it downstream
export const publicClient$: BehaviorSubject<(PublicClient & { chain: Chain }) | null> = new BehaviorSubject<
  (PublicClient & { chain: Chain }) | null
>(null);
// require chain for now so we can use it downstream
export const walletClient$: BehaviorSubject<(WalletClient & { chain: Chain }) | null> = new BehaviorSubject<
  (WalletClient & { chain: Chain }) | null
>(null);

export const cacheStore$ = new BehaviorSubject<CacheStore | null>(null);

export const worldAddress$ = new BehaviorSubject<string | null>(null);
export const worldAbi$ = new BehaviorSubject<Abi>(IWorldKernel__factory.abi);
