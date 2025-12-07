import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum, base, baseSepolia, polygon } from "@reown/appkit/networks";

// Get projectId from https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '';

if (!projectId) {
  if (typeof window === 'undefined') {
    // Server-side: throw error during build
    throw new Error(
      "Project ID is not defined. Please set NEXT_PUBLIC_REOWN_PROJECT_ID in your environment variables"
    );
  } else {
    // Client-side: log warning instead of throwing (prevents app crash)
    console.error(
      "NEXT_PUBLIC_REOWN_PROJECT_ID is not defined. Please set it in your Vercel environment variables and redeploy."
    );
  }
}

export const networks = [mainnet, arbitrum, base, baseSepolia, polygon];

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;



