# Backend Integration Guide

This document explains how to integrate the backend API with the frontend and smart contract.

## Integration Flow

### 1. User Registration Flow

When a new user registers on the platform:

```javascript
// Frontend: ExpertSetup.tsx or ClientSetup.tsx

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Step 1: Register user on backend
  const backendResponse = await fetch('http://localhost:3001/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: address, // from useAccount()
      role: 'expert', // or 'client'
      fullName: formData.fullName,
      professionalTitle: formData.professionalTitle, // expert only
      areaOfExpertise: formData.areaOfExpertise, // expert only
      hourlyRate: formData.hourlyRate, // expert only
      company: formData.company // client only
    })
  });

  if (!backendResponse.ok) {
    const error = await backendResponse.json();
    throw new Error(error.error || 'Registration failed');
  }

  // Step 2: Register on smart contract
  try {
    const contract = getContract(); // Your contract instance
    if (role === 'expert') {
      await contract.registerExpert(address);
    } else {
      await contract.registerClient(address);
    }
  } catch (error) {
    // If contract registration fails, you might want to rollback backend registration
    console.error('Contract registration failed:', error);
    // Optionally: DELETE /api/users/:address to rollback
  }

  // Step 3: Save role locally and navigate
  setUserRole(role);
  router.push(`/${address}/dashboard/${role === 'expert' ? 'overview' : 'browse-experts'}`);
};
```

### 2. User Login/Return Visit Flow

When a user returns to the platform:

```javascript
// Frontend: App initialization or page load

useEffect(() => {
  const checkUserRegistration = async () => {
    if (!address || !isConnected) return;

    try {
      // Step 1: Check backend first (faster)
      const response = await fetch(`http://localhost:3001/api/users/${address}`);
      
      if (response.ok) {
        const { user } = await response.json();
        
        // User exists in backend
        setUserRole(user.role);
        
        // Verify on-chain registration (optional but recommended)
        const isRegisteredOnChain = await contract.isExpert(address) || 
                                     await contract.isClient(address);
        
        if (!isRegisteredOnChain) {
          // User exists in backend but not on-chain - re-register on-chain
          if (user.role === 'expert') {
            await contract.registerExpert(address);
          } else {
            await contract.registerClient(address);
          }
        }
        
        // Navigate to dashboard
        router.push(`/${address}/dashboard/${user.role === 'expert' ? 'overview' : 'browse-experts'}`);
        return;
      }
      
      // Step 2: If not in backend, check on-chain
      const isExpert = await contract.isExpert(address);
      const isClient = await contract.isClient(address);
      
      if (isExpert || isClient) {
        // User exists on-chain but not in backend - sync to backend
        const role = isExpert ? 'expert' : 'client';
        
        // Fetch user data from chain or use defaults
        await fetch('http://localhost:3001/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            role,
            fullName: '', // You might want to fetch from chain or use defaults
            // ... other fields
          })
        });
        
        setUserRole(role);
        router.push(`/${address}/dashboard/${role === 'expert' ? 'overview' : 'browse-experts'}`);
        return;
      }
      
      // Step 3: User not registered - show role selection
      // (existing flow)
      
    } catch (error) {
      console.error('Error checking user registration:', error);
    }
  };

  checkUserRegistration();
}, [address, isConnected]);
```

### 3. Fetching Expert List

When displaying experts on the browse page:

```javascript
// Frontend: ClientBrowseExperts.tsx

const fetchExperts = async () => {
  try {
    // Fetch from backend (includes all user data)
    const response = await fetch('http://localhost:3001/api/users?role=expert');
    const { users } = await response.json();
    
    // Transform to match your Expert interface
    const experts = users.map(user => ({
      id: user.address,
      name: user.fullName,
      title: user.professionalTitle,
      expertise: user.areaOfExpertise.split(',').map(e => e.trim()),
      walletAddress: user.address,
      rating: 0, // You can add this to backend later
      reviewCount: 0, // You can add this to backend later
      hourlyRate: user.hourlyRate
    }));
    
    setExperts(experts);
  } catch (error) {
    console.error('Error fetching experts:', error);
  }
};
```

## Environment Variables

Create a `.env.local` file in your frontend root:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Then use it in your frontend:

```javascript
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
```

## API Client Utility

Create a utility file for API calls:

```typescript
// src/utils/api.ts

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const api = {
  async registerUser(data: {
    address: string;
    role: 'expert' | 'client';
    fullName: string;
    professionalTitle?: string;
    areaOfExpertise?: string;
    hourlyRate?: string;
    company?: string;
  }) {
    const response = await fetch(`${BACKEND_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    return response.json();
  },

  async getUser(address: string) {
    const response = await fetch(`${BACKEND_URL}/api/users/${address}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    const { user } = await response.json();
    return user;
  },

  async getAllExperts() {
    const response = await fetch(`${BACKEND_URL}/api/users?role=expert`);
    const { users } = await response.json();
    return users;
  },

  async getAllClients() {
    const response = await fetch(`${BACKEND_URL}/api/users?role=client`);
    const { users } = await response.json();
    return users;
  },

  async updateUser(address: string, updates: Partial<User>) {
    const response = await fetch(`${BACKEND_URL}/api/users/${address}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Update failed');
    }
    
    return response.json();
  }
};
```

## Error Handling

Always handle errors gracefully:

```javascript
try {
  await api.registerUser(userData);
} catch (error) {
  if (error.message.includes('already registered')) {
    // User already exists - proceed to dashboard
    router.push(`/${address}/dashboard/overview`);
  } else {
    // Show error to user
    setError(error.message);
  }
}
```

## Testing the Integration

1. Start the backend:
```bash
cd backend
npm run dev
```

2. Test registration:
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "role": "expert",
    "fullName": "John Doe",
    "professionalTitle": "Senior PM",
    "areaOfExpertise": "Web3, DeFi",
    "hourlyRate": "300"
  }'
```

3. Test retrieval:
```bash
curl http://localhost:3001/api/users/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

## Next Steps

1. Add authentication/authorization if needed
2. Add rate limiting
3. Upgrade to a real database (PostgreSQL, MongoDB, etc.)
4. Add user profile images
5. Add ratings and reviews system
6. Add analytics and tracking

