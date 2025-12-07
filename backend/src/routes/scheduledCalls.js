import express from 'express';
import {
  createCall,
  getClientCalls,
  getExpertCalls,
  confirmCall,
  getCallById,
  updateCall,
  acceptChanges,
} from '../controllers/scheduledCallController.js';

const router = express.Router();

// Create a new scheduled call
router.post('/', createCall);

// Get scheduled calls for a client
router.get('/client/:address', getClientCalls);

// Get scheduled calls for an expert
router.get('/expert/:address', getExpertCalls);

// Confirm a scheduled call
router.patch('/:id/confirm', confirmCall);

// Update a scheduled call with proposed changes
router.patch('/:id/update', updateCall);

// Accept proposed changes (client confirms)
router.patch('/:id/accept-changes', acceptChanges);

// Get a scheduled call by ID
router.get('/:id', getCallById);

export { router as scheduledCallRouter };

