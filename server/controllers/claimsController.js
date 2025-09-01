const db = require('../config/db');

// Create a new claim
const createClaim = async (req, res) => {
  try {
    const { source_url, claim_statement } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate input
    if (!source_url || !claim_statement) {
      return res.status(400).json({ error: 'Source URL and claim statement are required' });
    }

    // Insert new claim
    const newClaim = await db.query(
      'INSERT INTO claims (submitted_by, source_url, claim_statement) VALUES ($1, $2, $3) RETURNING *',
      [userId, source_url, claim_statement]
    );

    res.status(201).json({
      message: 'Claim created successfully',
      claim: newClaim.rows[0]
    });

  } catch (error) {
    console.error('Create claim error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all recent claims
const getAllClaims = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    // Get claims with user information
    const claims = await db.query(
      `SELECT 
        c.claim_id,
        c.source_url,
        c.claim_statement,
        c.status,
        c.created_at,
        u.username as submitted_by_username
      FROM claims c
      JOIN users u ON c.submitted_by = u.user_id
      ORDER BY c.created_at DESC
      LIMIT $1 OFFSET $2`,
      [parseInt(limit), parseInt(offset)]
    );

    // Get total count for pagination
    const totalCount = await db.query('SELECT COUNT(*) FROM claims');
    const total = parseInt(totalCount.rows[0].count);

    res.json({
      claims: claims.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < total
      }
    });

  } catch (error) {
    console.error('Get all claims error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single claim by ID
const getClaimById = async (req, res) => {
  try {
    const { claimId } = req.params;

    // Get claim with user information
    const claim = await db.query(
      `SELECT 
        c.claim_id,
        c.source_url,
        c.claim_statement,
        c.status,
        c.created_at,
        u.username as submitted_by_username,
        u.user_id as submitted_by_id
      FROM claims c
      JOIN users u ON c.submitted_by = u.user_id
      WHERE c.claim_id = $1`,
      [claimId]
    );

    if (claim.rows.length === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Get vote counts for this claim
    const voteCounts = await db.query(
      `SELECT 
        vote_type,
        COUNT(*) as count
      FROM votes
      WHERE claim_id = $1
      GROUP BY vote_type`,
      [claimId]
    );

    // Get evidence for this claim
    const evidence = await db.query(
      `SELECT 
        e.evidence_id,
        e.evidence_link,
        e.comment,
        e.submitted_at,
        u.username as submitted_by_username
      FROM evidence e
      JOIN users u ON e.user_id = u.user_id
      WHERE e.claim_id = $1
      ORDER BY e.submitted_at DESC`,
      [claimId]
    );

    // Format vote counts
    const votes = {
      true: 0,
      false: 0,
      misleading: 0
    };

    voteCounts.rows.forEach(vote => {
      votes[vote.vote_type] = parseInt(vote.count);
    });

    res.json({
      claim: claim.rows[0],
      votes,
      evidence: evidence.rows
    });

  } catch (error) {
    console.error('Get claim by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createClaim,
  getAllClaims,
  getClaimById
};
