"use client";

import { wagmiAdapter, projectId } from "../../config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, arbitrum, base, baseSepolia, polygon } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "KonsultPay",
  description: "Real-time payment streaming for expert consultations",
  url:
    typeof window !== "undefined"
      ? window.location.origin
      : "https://example.com",
  icons: [
    typeof window !== "undefined"
      ? `${window.location.origin}/favicon.ico`
      : "https://example.com/favicon.ico",
  ],
};

// Create the modal (initialize AppKit)
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, base, baseSepolia, polygon],
  defaultNetwork: baseSepolia,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

function AppKitContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default AppKitContextProvider;
