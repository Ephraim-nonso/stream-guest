# StreamGuestPay

A real-time payment streaming platform for expert consultations. Get paid per second with complete transparency and zero trust required.

## Overview

StreamGuestPay is a Web3-powered platform that revolutionizes how experts get paid for consultations. Instead of traditional invoicing and payment delays, payments stream directly into the expert's wallet every second during the call. The stream automatically stops when the call ends, providing complete transparency and control for both parties.

## The Aim of the Project

StreamGuestPay aims to:

- **Eliminate Payment Friction**: No more invoicing, waiting, or follow-ups. Money flows in real-time during consultations.
- **Provide Complete Transparency**: Both experts and clients can see payments streaming in real-time with blockchain verification.
- **Filter Low-Intent Outreach**: Require a $1 test deposit before scheduling, eliminating 95% of low-intent inquiries.
- **Enable Zero-Risk Consultations**: Stream stops immediately when the call ends, giving both parties complete control.
- **Create Trustless Payments**: Leverage blockchain technology to remove the need for trust between parties.

### Key Features

- **Real-Time Payment Streaming**: Payments flow per second during consultations via USDC streams
- **Expert Dashboard**: Track earnings, completed calls, hourly rates, and manage scheduled consultations
- **Client Dashboard**: Browse experts, schedule consultations, send test deposits, and view call history
- **Wallet Integration**: Seamless wallet connection using WalletConnect (Reown AppKit)
- **Role-Based Access**: Separate dashboards for experts and clients with tailored experiences

## Tools Used

### Frontend Framework

- **[Next.js](https://nextjs.org)** - React framework for production with server-side rendering and optimized performance
  - App Router for modern routing
  - Server Components and Client Components
  - Built-in optimization and performance features

### Wallet Integration

- **[WalletConnect (https://docs.reown.com/appkit)** - Web3 wallet connection solution
  - Multi-wallet support (MetaMask, Coinbase Wallet, WalletConnect, etc.)
  - Seamless connection experience

### Blockchain Libraries

- **[Wagmi](https://wagmi.sh)** - React hooks for Ethereum
- **[Viem](https://viem.sh)** - TypeScript Ethereum library
- **[@tanstack/react-query](https://tanstack.com/query)** - Data fetching and state management

### Styling

- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- Custom design system with responsive layouts

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn installed
- A WalletConnect Project ID from [Reown Dashboard](https://dashboard.reown.com)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd stream-guest
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
```

4. Run the development server:

```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
stream-guest/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── common/       # Shared components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components
│   ├── context/          # React context providers
│   ├── lib/              # Utility functions
│   └── styles/           # Global styles
├── config/               # Configuration files
└── public/               # Static assets
```

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to link your Web3 wallet
2. **Choose Role**: Select whether you're an Expert or Client
3. **Complete Setup**: Fill in your profile information
4. **Start Using**: Access your dashboard to browse experts, schedule calls, or manage consultations

## Future Features

- Chat functionality for real-time communication
- Payment streaming integration with Superfluid
- Advanced scheduling and calendar management
- Review and rating system
- Analytics and reporting

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Reown AppKit Documentation](https://docs.reown.com/appkit)
- [Wagmi Documentation](https://wagmi.sh)
- [Superfluid Documentation](https://docs.superfluid.finance)

