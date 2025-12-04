/**
 * Validation middleware for user registration
 */
export const validateUserRegistration = (req, res, next) => {
  const { address, role, ...userData } = req.body;

  // Validate address format (basic Ethereum address validation)
  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Valid wallet address is required' });
  }

  // Basic Ethereum address format check (0x followed by 40 hex characters)
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!addressRegex.test(address)) {
    return res.status(400).json({ error: 'Invalid wallet address format' });
  }

  // Validate role
  if (!role || !['expert', 'client'].includes(role)) {
    return res.status(400).json({ 
      error: 'Role is required and must be either "expert" or "client"' 
    });
  }

  // Validate role-specific fields
  if (role === 'expert') {
    if (!userData.fullName || typeof userData.fullName !== 'string' || userData.fullName.trim().length === 0) {
      return res.status(400).json({ error: 'Full name is required for experts' });
    }
    if (userData.hourlyRate !== undefined) {
      const rate = parseFloat(userData.hourlyRate);
      if (isNaN(rate) || rate < 0) {
        return res.status(400).json({ error: 'Hourly rate must be a valid positive number' });
      }
    }
  } else if (role === 'client') {
    if (!userData.fullName || typeof userData.fullName !== 'string' || userData.fullName.trim().length === 0) {
      return res.status(400).json({ error: 'Full name is required for clients' });
    }
  }

  next();
};

