/**
 * Test script to verify database setup and operations
 * Run with: node src/scripts/test-db.js
 */

import { initializeDatabase, getDB } from '../database/db.js';
import { saveUser, getUser, getAllUsers, updateUser, deleteUser } from '../storage/storage.js';

console.log('Testing database operations...\n');

try {
  // Initialize database
  console.log('1. Initializing database...');
  initializeDatabase();
  console.log('Database initialized\n');

  // Test data
  const testExpert = {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    role: 'expert',
    fullName: 'John Doe',
    professionalTitle: 'Senior Product Manager',
    areaOfExpertise: 'Web3, DeFi, Blockchain',
    hourlyRate: 300,
    registeredAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const testClient = {
    address: '0x8f9e5d2c1a4b3e7f6c8d9e0f1a2b3c4d5e6f7a8b9',
    role: 'client',
    fullName: 'Jane Smith',
    company: 'Tech Corp',
    registeredAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Test save user
  console.log('2. Testing saveUser (expert)...');
  saveUser(testExpert);
  console.log('Expert saved\n');

  console.log('3. Testing saveUser (client)...');
  saveUser(testClient);
  console.log('Client saved\n');

  // Test get user
  console.log('4. Testing getUser...');
  const retrievedExpert = getUser(testExpert.address);
  console.log('Retrieved expert:', retrievedExpert);
  console.log('User retrieved\n');

  // Test get all users
  console.log('5. Testing getAllUsers...');
  const allUsers = getAllUsers();
  console.log(`Found ${allUsers.length} users`);
  console.log('All users retrieved\n');

  // Test update user
  console.log('6. Testing updateUser...');
  const updatedExpert = {
    ...testExpert,
    hourlyRate: 350,
    updatedAt: new Date().toISOString()
  };
  updateUser(updatedExpert);
  const retrievedUpdated = getUser(testExpert.address);
  console.log('Updated hourly rate:', retrievedUpdated.hourlyRate);
  console.log('User updated\n');

  // Test delete user
  console.log('7. Testing deleteUser...');
  deleteUser(testClient.address);
  const remainingUsers = getAllUsers();
  console.log(`Remaining users: ${remainingUsers.length}`);
  console.log('User deleted\n');

  console.log('All database tests passed!');
  
} catch (error) {
  console.error('Test failed:', error);
  process.exit(1);
}

