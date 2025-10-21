const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/messages
// @desc    Get all messages (chat history)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('sender', 'username')
            .sort({ timestamp: 1 })
            .limit(100); // Limit to last 100 messages

        res.json({
            success: true,
            messages
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching messages',
            error: error.message
        });
    }
});

module.exports = router;
