/**
 * Contract Interaction Utilities
 *
 * Provides typed functions to interact with the ExpertClientMoneyRouter contract
 */

import { Address, encodeFunctionData, parseAbi } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants/contract";
import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";

// Contract function names for type safety
export const CONTRACT_FUNCTIONS = {
  // Registration
  registerExpert: "registerExpert",
  registerClient: "registerClient",
  unregisterExpert: "unregisterExpert",
  unregisterClient: "unregisterClient",

  // Flow management
  createFlow: "createFlow",
  updateFlow: "updateFlow",
  deleteFlow: "deleteFlow",

  // View functions
  isExpert: "isExpert",
  isClient: "isClient",
  getFlowRate: "getFlowRate",
  getExpertTotalFlowRate: "getExpertTotalFlowRate",
  getClientTotalFlowRate: "getClientTotalFlowRate",
} as const;

/**
 * Hook to register an expert on the contract
 */
export function useRegisterExpert() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const register = (expertAddress: Address) => {
    writeContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: CONTRACT_FUNCTIONS.registerExpert,
      args: [expertAddress],
    });
  };

  return {
    register,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to register a client on the contract
 */
export function useRegisterClient() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const register = (clientAddress: Address) => {
    writeContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: CONTRACT_FUNCTIONS.registerClient,
      args: [clientAddress],
    });
  };

  return {
    register,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to create a flow from client to expert
 */
export function useCreateFlow() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createFlow = (expertAddress: Address, flowRate: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS as Address,
      abi: CONTRACT_ABI,
      functionName: CONTRACT_FUNCTIONS.createFlow,
      args: [expertAddress, flowRate],
    });
  };

  return {
    createFlow,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to check if an address is a registered expert
 */
export function useIsExpert(address: Address | undefined) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as Address,
    abi: CONTRACT_ABI,
    functionName: CONTRACT_FUNCTIONS.isExpert,
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    isExpert: data as boolean | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to check if an address is a registered client
 */
export function useIsClient(address: Address | undefined) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as Address,
    abi: CONTRACT_ABI,
    functionName: CONTRACT_FUNCTIONS.isClient,
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    isClient: data as boolean | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook to get flow rate between client and expert
 */
export function useFlowRate(
  clientAddress: Address | undefined,
  expertAddress: Address | undefined
) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS as Address,
    abi: CONTRACT_ABI,
    functionName: CONTRACT_FUNCTIONS.getFlowRate,
    args:
      clientAddress && expertAddress
        ? [clientAddress, expertAddress]
        : undefined,
    query: {
      enabled: !!clientAddress && !!expertAddress,
    },
  });

  return {
    flowRate: data as bigint | undefined,
    isLoading,
    error,
  };
}

