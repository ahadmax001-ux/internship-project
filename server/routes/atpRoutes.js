const express = require('express');
const router = express.Router();
const {
  getParameterSpecs,
  calculateScorePreview,
  createATPRecord,
  getAllATPRecords,
  getATPRecordById,
  deleteATPRecord,
} = require('../controllers/atpController');

// Parameter specs and weights
router.get('/specs', getParameterSpecs);

// Calculate score preview without persisting
router.post('/calculate', calculateScorePreview);

// Create and save new ATP score record
router.post('/', createATPRecord);

// Get score history with filters
router.get('/', getAllATPRecords);

// Get single score record
router.get('/:id', getATPRecordById);

// Delete single score record
router.delete('/:id', deleteATPRecord);

module.exports = router;
