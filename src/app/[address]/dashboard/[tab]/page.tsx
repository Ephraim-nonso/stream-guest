"use client";

import { useParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ExpertOverview } from "@/components/dashboard/expert/ExpertOverview";
import { ExpertSchedule } from "@/components/dashboard/expert/ExpertSchedule";
import { ExpertHistory } from "@/components/dashboard/expert/ExpertHistory";
import { ExpertChats } from "@/components/dashboard/expert/ExpertChats";
import { ExpertWallet } from "@/components/wallet/ExpertWallet";
import { ClientBrowseExperts } from "@/components/dashboard/client/ClientBrowseExperts";
import { ClientScheduledCalls } from "@/components/dashboard/client/ClientScheduledCalls";
import { ClientHistory } from "@/components/dashboard/client/ClientHistory";
import { ClientChats } from "@/components/dashboard/client/ClientChats";
import { ClientWallet } from "@/components/wallet/ClientWallet";

type TabType =
  | "overview"
  | "schedule"
  | "history"
  | "chats"
  | "browse-experts"
  | "scheduled-calls"
  | "wallet";

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { address: connectedAddress, isConnected } = useAccount();
  const [userRole] = useLocalStorage<"expert" | "client" | null>(
    "userRole",
    null
  );

  const address = params.address as string;
  const tab = params.tab as TabType;

  // Determine if user is expert or client
  // Only use userRole from localStorage - no fallback inference
  // If no role is set, user will be redirected to home page
  const effectiveRole = userRole;
  const isLoading = !isConnected || !connectedAddress || !userRole;

  // Redirect if wallet is not connected, address doesn't match, or no role is set
  useEffect(() => {
    if (!isConnected || !connectedAddress) {
      router.push("/");
      return;
    }

    // If user hasn't set a role yet, redirect to home to choose role
    if (!userRole) {
      router.push("/");
      return;
    }

    // Normalize addresses for comparison (case-insensitive)
    if (address.toLowerCase() !== connectedAddress.toLowerCase()) {
      // Redirect to the correct address's dashboard
      const defaultTab = userRole === "client" ? "browse-experts" : "overview";
      router.push(`/${connectedAddress}/dashboard/${defaultTab}`);
      return;
    }
  }, [isConnected, connectedAddress, address, router, userRole]);

  // Redirect to appropriate default if tab doesn't match role
  useEffect(() => {
    if (isLoading || !effectiveRole) return;

    const expertTabs = ["overview", "schedule", "history", "chats", "wallet"];
    const clientTabs = [
      "browse-experts",
      "scheduled-calls",
      "history",
      "chats",
      "wallet",
    ];

    if (effectiveRole === "expert" && !expertTabs.includes(tab)) {
      router.push(`/${address}/dashboard/overview`);
    } else if (effectiveRole === "client" && !clientTabs.includes(tab)) {
      router.push(`/${address}/dashboard/browse-experts`);
    }
  }, [tab, effectiveRole, address, router, isLoading]);

  // Render appropriate content based on tab and role
  const renderContent = () => {
    if (!effectiveRole) return null;

    if (effectiveRole === "expert") {
      switch (tab) {
        case "overview":
          return <ExpertOverview />;
        case "schedule":
          return <ExpertSchedule />;
        case "history":
          return <ExpertHistory />;
        case "chats":
          return <ExpertChats />;
        case "wallet":
          return <ExpertWallet />;
        default:
          return <ExpertOverview />;
      }
    } else if (effectiveRole === "client") {
      switch (tab) {
        case "browse-experts":
          return <ClientBrowseExperts />;
        case "scheduled-calls":
          return <ClientScheduledCalls />;
        case "history":
          return <ClientHistory />;
        case "chats":
          return <ClientChats />;
        case "wallet":
          return <ClientWallet />;
        default:
          return <ClientBrowseExperts />;
      }
    }
    return null;
  };

  if (!isConnected || !connectedAddress || isLoading || !effectiveRole) {
    return null; // Will redirect or loading
  }

  return (
    <DashboardLayout
      address={address}
      isExpert={effectiveRole === "expert"}
      activeTab={tab}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
