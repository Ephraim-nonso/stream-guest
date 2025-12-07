import {
  createScheduledCall,
  getScheduledCallsByClient,
  getScheduledCallsByExpert,
  confirmScheduledCall,
  getScheduledCallById,
  updateScheduledCall,
  acceptProposedChanges,
} from '../storage/storage.js';

/**
 * Create a new scheduled call
 */
export const createCall = async (req, res) => {
  try {
    const { clientAddress, expertAddress, date, time, duration, hourlyRate, topics } = req.body;

    // Validation
    if (!clientAddress || !expertAddress || !date || !time || !hourlyRate) {
      return res.status(400).json({
        error: 'Missing required fields: clientAddress, expertAddress, date, time, hourlyRate'
      });
    }

    // Validate that the scheduled time is in the future
    const now = new Date();
    const scheduledDateTime = new Date(`${date}T${time}`);
    const oneMinuteFromNow = new Date(now.getTime() + 60000); // 1 minute buffer
    
    if (scheduledDateTime <= oneMinuteFromNow) {
      return res.status(400).json({
        error: 'Scheduled date and time must be at least 1 minute in the future'
      });
    }

    const call = createScheduledCall({
      clientAddress,
      expertAddress,
      date,
      time,
      duration: duration || 60,
      hourlyRate,
      topics: topics || [],
      status: 'pending'
    });

    res.status(201).json({
      message: 'Scheduled call created successfully',
      call
    });
  } catch (error) {
    console.error('Error creating scheduled call:', error);
    res.status(500).json({
      error: error.message || 'Failed to create scheduled call'
    });
  }
};

/**
 * Get scheduled calls for a client
 */
export const getClientCalls = async (req, res) => {
  try {
    const { address } = req.params;
    const calls = getScheduledCallsByClient(address);
    res.json({ calls });
  } catch (error) {
    console.error('Error getting client calls:', error);
    res.status(500).json({
      error: 'Failed to fetch scheduled calls'
    });
  }
};

/**
 * Get scheduled calls for an expert
 */
export const getExpertCalls = async (req, res) => {
  try {
    const { address } = req.params;
    const calls = getScheduledCallsByExpert(address);
    res.json({ calls });
  } catch (error) {
    console.error('Error getting expert calls:', error);
    res.status(500).json({
      error: 'Failed to fetch scheduled calls'
    });
  }
};

/**
 * Confirm a scheduled call
 */
export const confirmCall = async (req, res) => {
  try {
    const { id } = req.params;
    const call = confirmScheduledCall(id);

    if (!call) {
      return res.status(404).json({
        error: 'Scheduled call not found'
      });
    }

    res.json({
      message: 'Scheduled call confirmed successfully',
      call
    });
  } catch (error) {
    console.error('Error confirming scheduled call:', error);
    res.status(500).json({
      error: error.message || 'Failed to confirm scheduled call'
    });
  }
};

/**
 * Get a scheduled call by ID
 */
export const getCallById = async (req, res) => {
  try {
    const { id } = req.params;
    const call = getScheduledCallById(id);

    if (!call) {
      return res.status(404).json({
        error: 'Scheduled call not found'
      });
    }

    res.json({ call });
  } catch (error) {
    console.error('Error getting scheduled call:', error);
    res.status(500).json({
      error: 'Failed to fetch scheduled call'
    });
  }
};

/**
 * Update a scheduled call with proposed changes
 */
export const updateCall = async (req, res) => {
  try {
    const { id } = req.params;
    const { proposedDate, proposedTime, proposedDuration, proposedTopics } = req.body;

    // Validation
    if (!proposedDate || !proposedTime) {
      return res.status(400).json({
        error: 'Missing required fields: proposedDate, proposedTime'
      });
    }

    // Validate that the proposed time is in the future
    const now = new Date();
    const proposedDateTime = new Date(`${proposedDate}T${proposedTime}`);
    const oneMinuteFromNow = new Date(now.getTime() + 60000); // 1 minute buffer
    
    if (proposedDateTime <= oneMinuteFromNow) {
      return res.status(400).json({
        error: 'Proposed date and time must be at least 1 minute in the future'
      });
    }

    const call = updateScheduledCall(id, {
      proposedDate,
      proposedTime,
      proposedDuration: proposedDuration || undefined,
      proposedTopics: proposedTopics || [],
      status: 'pending_changes'
    });

    if (!call) {
      return res.status(404).json({
        error: 'Scheduled call not found'
      });
    }

    res.json({
      message: 'Proposed changes saved successfully',
      call
    });
  } catch (error) {
    console.error('Error updating scheduled call:', error);
    res.status(500).json({
      error: error.message || 'Failed to update scheduled call'
    });
  }
};

/**
 * Accept proposed changes (client confirms expert's changes)
 */
export const acceptChanges = async (req, res) => {
  try {
    const { id } = req.params;
    const call = acceptProposedChanges(id);

    if (!call) {
      return res.status(404).json({
        error: 'Scheduled call not found'
      });
    }

    res.json({
      message: 'Proposed changes accepted successfully',
      call
    });
  } catch (error) {
    console.error('Error accepting proposed changes:', error);
    res.status(500).json({
      error: error.message || 'Failed to accept proposed changes'
    });
  }
};

