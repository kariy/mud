import { createPublicClient, createWalletClient, getContract, http, fallback, webSocket, isHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
// TODO: rewrite this util to work in node
import { getBurnerWallet } from "@latticexyz/std-client";
import { IWorld__factory } from "contracts/types/ethers-contracts";
import { setupViemNetwork } from "./setupViemNetwork";
import { supportedChains } from "./supportedChains";
import { worlds } from "./worlds";
import * as devObservables from "@latticexyz/network/dev";

const worldAbi = IWorld__factory.abi;

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup() {
  // TODO: abstract this to work in node
  const params = new URLSearchParams(window.location.search);

  const chainId = Number(params.get("chainId") || import.meta.env.VITE_CHAIN_ID || 31337);
  const chain = supportedChains.find((c) => c.id === chainId);
  if (!chain) {
    throw new Error(`Chain ${chainId} not found`);
  }

  const world = worlds[chain.id.toString()];
  const worldAddress = params.get("worldAddress") || world?.address;
  if (!worldAddress || !isHex(worldAddress)) {
    throw new Error(`No world address found for chain ${chainId}. Did you run \`mud deploy\`?`);
  }
  if (!isHex(worldAddress)) {
    throw new Error(`World address "${worldAddress}" is not a valid hex string.`);
  }

  const publicClient = createPublicClient({
    chain,
    transport: fallback([webSocket(), http()]),
    // TODO: do this per chain? maybe in the MUDChain config?
    pollingInterval: 1000,
  });

  const burnerAccount = privateKeyToAccount(getBurnerWallet().value);
  const burnerWalletClient = createWalletClient({
    account: burnerAccount,
    chain,
    transport: fallback([webSocket(), http()]),
    pollingInterval: 1000,
  });

  // TODO: get fromBlock from worlds and/or from URL params, pass to network setup
  const { storeCache } = await setupViemNetwork(publicClient, worldAddress);

  devObservables.worldAbi$.next(worldAbi);

  return {
    chain,
    worldAddress,
    worldAbi,
    publicClient,
    // TODO: consider another export name to make room for connected wallet account/client
    account: burnerAccount,
    walletClient: burnerWalletClient,
    world: getContract({
      address: worldAddress,
      abi: worldAbi,
      publicClient,
      walletClient: burnerWalletClient,
    }),
    storeCache,
  };
}
