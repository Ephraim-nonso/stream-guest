/**
 * Integration Utilities
 * 
 * Combines backend API and smart contract interactions
 * for seamless user registration and management
 */

import { Address } from 'viem';
import { registerUser, getUser, type ExpertRegistrationData, type ClientRegistrationData } from './api';
import { useRegisterExpert, useRegisterClient } from './contract';

/**
 * Register a user on both backend and smart contract
 * 
 * This is the main integration function that:
 * 1. Registers the user on the backend (stores profile data)
 * 2. Registers the user on the smart contract (on-chain registration)
 */
export async function registerUserComplete(
  data: ExpertRegistrationData | ClientRegistrationData,
  registerOnChain: (address: Address) => Promise<void>
): Promise<{ backend: any; contract: void }> {
  // Step 1: Register on backend
  const backendResult = await registerUser(data);

  // Step 2: Register on smart contract
  await registerOnChain(data.address as Address);

  return {
    backend: backendResult,
    contract: undefined,
  };
}

/**
 * Check if user is registered (checks both backend and contract)
 */
export async function checkUserRegistration(
  address: string,
  isRegisteredOnChain: (address: Address) => Promise<boolean>
): Promise<{
  registered: boolean;
  source: 'backend' | 'contract' | 'both' | null;
  user?: any;
}> {
  // Check backend first (faster)
  const backendUser = await getUser(address);

  // Check contract
  const contractRegistered = await isRegisteredOnChain(address as Address);

  if (backendUser && contractRegistered) {
    return {
      registered: true,
      source: 'both',
      user: backendUser,
    };
  }

  if (backendUser) {
    return {
      registered: true,
      source: 'backend',
      user: backendUser,
    };
  }

  if (contractRegistered) {
    return {
      registered: true,
      source: 'contract',
    };
  }

  return {
    registered: false,
    source: null,
  };
}

/**
 * Sync user from contract to backend
 * 
 * If user exists on-chain but not in backend, create backend entry
 */
export async function syncUserToBackend(
  address: string,
  role: 'expert' | 'client',
  defaultData: Partial<ExpertRegistrationData | ClientRegistrationData>
): Promise<void> {
  const existingUser = await getUser(address);

  if (!existingUser) {
    // User exists on-chain but not in backend - create backend entry
    await registerUser({
      address,
      role,
      fullName: defaultData.fullName || '',
      ...(role === 'expert'
        ? {
            professionalTitle: (defaultData as ExpertRegistrationData).professionalTitle || '',
            areaOfExpertise: (defaultData as ExpertRegistrationData).areaOfExpertise || '',
            hourlyRate: (defaultData as ExpertRegistrationData).hourlyRate || '0',
          }
        : {
            company: (defaultData as ClientRegistrationData).company || '',
          }),
    } as ExpertRegistrationData | ClientRegistrationData);
  }
}


