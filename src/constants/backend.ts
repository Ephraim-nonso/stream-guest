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
} as const;


