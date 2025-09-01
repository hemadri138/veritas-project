const express = require('express');
const router = express.Router();

// Import controllers
const { createClaim, getAllClaims, getClaimById } = require('../controllers/claimsController');

// Import middleware
const authMiddleware = require('../middleware/authMiddleware');

// Get all recent claims
router.get('/', getAllClaims);

// Get a single claim by ID
router.get('/:claimId', getClaimById);

// Create a new claim (protected route)
router.post('/', authMiddleware, createClaim);

module.exports = router;
