/**
 * Backend API Client
 * 
 * Provides typed functions to interact with the backend API
 */

import { API_ENDPOINTS } from '@/constants/backend';

export interface ExpertRegistrationData {
  address: string;
  role: 'expert';
  fullName: string;
  professionalTitle: string;
  areaOfExpertise: string;
  hourlyRate: string;
}

export interface ClientRegistrationData {
  address: string;
  role: 'client';
  fullName: string;
  company: string;
}

export interface User {
  address: string;
  role: 'expert' | 'client';
  fullName: string;
  professionalTitle?: string;
  areaOfExpertise?: string;
  hourlyRate?: number;
  company?: string;
  registeredAt: string;
  updatedAt: string;
}

/**
 * Register a new user (expert or client) on the backend
 */
export async function registerUser(
  data: ExpertRegistrationData | ClientRegistrationData
): Promise<{ message: string; user: User }> {
  const response = await fetch(API_ENDPOINTS.registerUser, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  return response.json();
}

/**
 * Get user by wallet address
 */
export async function getUser(address: string): Promise<User | null> {
  const response = await fetch(API_ENDPOINTS.getUser(address));

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  const { user } = await response.json();
  return user;
}

/**
 * Get all users, optionally filtered by role
 */
export async function getAllUsers(role?: 'expert' | 'client'): Promise<User[]> {
  const url = role 
    ? `${API_ENDPOINTS.getAllUsers}?role=${role}`
    : API_ENDPOINTS.getAllUsers;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const { users } = await response.json();
  return users;
}

/**
 * Update user information
 */
export async function updateUser(
  address: string,
  updates: Partial<User>
): Promise<{ message: string; user: User }> {
  const response = await fetch(API_ENDPOINTS.updateUser(address), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Update failed');
  }

  return response.json();
}

/**
 * Delete a user
 */
export async function deleteUser(address: string): Promise<{ message: string }> {
  const response = await fetch(API_ENDPOINTS.deleteUser(address), {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Delete failed');
  }

  return response.json();
}


