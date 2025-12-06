/**
 * Smart Contract Configuration
 * 
 * This file contains the contract address, ABI, and network configuration.
 * It's automatically updated when you deploy the contract using the deployment script.
 */

// Import ABI - will be populated after contract deployment
let contractAbi: any[] = [];
try {
  contractAbi = require('./contract-abi.json');
} catch (e) {
  console.warn('Contract ABI not found. Run deployment script and copy-abi.sh');
}

// Base Sepolia Network Configuration
export const BASE_SEPOLIA = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://sepolia.basescan.org',
    },
  },
  testnet: true,
} as const;

// Contract address - will be set after deployment
// For now, use a placeholder. After deployment, update this with the actual address
export const CONTRACT_ADDRESS = 
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 
  '0x0000000000000000000000000000000000000000';

// Superfluid Host address on Base Sepolia
export const SUPERFLUID_HOST = 
  process.env.NEXT_PUBLIC_SUPERFLUID_HOST || 
  '0x4C073B3baB6e8826C59D2dB5f913204a6474CaB7';

// Accepted SuperToken address
export const ACCEPTED_TOKEN = 
  process.env.NEXT_PUBLIC_ACCEPTED_TOKEN || 
  '0x0000000000000000000000000000000000000000';

// Contract ABI
export const CONTRACT_ABI = contractAbi;

// Contract configuration object
export const contractConfig = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: CONTRACT_ABI,
  chainId: BASE_SEPOLIA.id,
} as const;

// Helper to check if contract is configured
export const isContractConfigured = () => {
  return CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';
};

