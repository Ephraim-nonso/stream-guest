import express from 'express';
import { 
  registerUser, 
  getUserByAddress, 
  getAllUsers,
  updateUser,
  deleteUser 
} from '../controllers/userController.js';
import { validateUserRegistration } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new expert or client
 * @access  Public
 */
router.post('/register', validateUserRegistration, registerUser);

/**
 * @route   GET /api/users/:address
 * @desc    Get user by wallet address
 * @access  Public
 */
router.get('/:address', getUserByAddress);

/**
 * @route   GET /api/users
 * @desc    Get all users (with optional filtering)
 * @access  Public
 */
router.get('/', getAllUsers);

/**
 * @route   PUT /api/users/:address
 * @desc    Update user information
 * @access  Public
 */
router.put('/:address', updateUser);

/**
 * @route   DELETE /api/users/:address
 * @desc    Delete a user
 * @access  Public
 */
router.delete('/:address', deleteUser);

export { router as userRouter };

