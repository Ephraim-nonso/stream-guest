import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import "../styles/variables.css";
import { AppProvider } from "@/context/AppContext";
import AppKitContextProvider from "@/context/AppKitContext";
import { StreamChatProvider } from "@/components/chat/StreamChatProvider";
import { UnreadCountProvider } from "@/components/chat/UnreadCountContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StreamPay - Get Paid Per Second",
  description: "Real-time payment streaming for expert consultations. Get paid instantly via USDC streams powered by Superfluid.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppKitContextProvider cookies={cookies}>
          <AppProvider>
            <UnreadCountProvider>
              <StreamChatProvider>
                {children}
              </StreamChatProvider>
            </UnreadCountProvider>
          </AppProvider>
        </AppKitContextProvider>
      </body>
    </html>
  );
}
