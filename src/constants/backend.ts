/**
 * Backend API Configuration
 */

export const BACKEND_URL = 
  process.env.NEXT_PUBLIC_BACKEND_URL || 
  'http://localhost:3001';

export const API_ENDPOINTS = {
  // User endpoints
  registerUser: `${BACKEND_URL}/api/users/register`,
  getUser: (address: string) => `${BACKEND_URL}/api/users/${address}`,
  getAllUsers: `${BACKEND_URL}/api/users`,
  updateUser: (address: string) => `${BACKEND_URL}/api/users/${address}`,
  deleteUser: (address: string) => `${BACKEND_URL}/api/users/${address}`,
  
  // Health check
  health: `${BACKEND_URL}/health`,
  
  // Scheduled Calls
  createScheduledCall: `${BACKEND_URL}/api/scheduled-calls`,
  getClientScheduledCalls: (address: string) => `${BACKEND_URL}/api/scheduled-calls/client/${address}`,
  getExpertScheduledCalls: (address: string) => `${BACKEND_URL}/api/scheduled-calls/expert/${address}`,
  confirmScheduledCall: (id: number) => `${BACKEND_URL}/api/scheduled-calls/${id}/confirm`,
  updateScheduledCall: (id: number) => `${BACKEND_URL}/api/scheduled-calls/${id}/update`,
  acceptScheduledCallChanges: (id: number) => `${BACKEND_URL}/api/scheduled-calls/${id}/accept-changes`,
  getScheduledCallById: (id: number) => `${BACKEND_URL}/api/scheduled-calls/${id}`,
} as const;


