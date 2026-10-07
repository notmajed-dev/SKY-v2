import express from 'express';

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'SKY-v2 Backend' });
});

/**
 * Placeholder endpoints for log ingestion & analytics
 */
router.post('/logs/upload', (req, res) => {
  // Logic comes in future checkpoints
  res.status(501).json({ message: 'Endpoint not implemented yet' });
});

router.get('/logs/analytics', (req, res) => {
  // Logic comes in future checkpoints
  res.status(501).json({ message: 'Endpoint not implemented yet' });
});

export default router;
