// Application routes constants
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  // Dynamic dashboard routes
  DASHBOARD: (address: string, tab: string) => `/${address}/dashboard/${tab}`,
  EXPERT_DASHBOARD: {
    OVERVIEW: (address: string) => `/${address}/dashboard/overview`,
    SCHEDULE: (address: string) => `/${address}/dashboard/schedule`,
    HISTORY: (address: string) => `/${address}/dashboard/history`,
    CHATS: (address: string) => `/${address}/dashboard/chats`,
  },
  CLIENT_DASHBOARD: {
    BROWSE_EXPERTS: (address: string) => `/${address}/dashboard/browse-experts`,
    SCHEDULED_CALLS: (address: string) => `/${address}/dashboard/scheduled-calls`,
    HISTORY: (address: string) => `/${address}/dashboard/history`,
    CHATS: (address: string) => `/${address}/dashboard/chats`,
  },
} as const;


