// routes/leadRoutes.js
const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadsController');

// Route for submitting lead data
router.post('/submit', leadController.submitLead);

// Route for fetching all lead data
router.get('/fetch', leadController.fetchLeads);

// Route for downloading leads as a CSV file
router.get('/download-csv', leadController.downloadLeadsCsv);

module.exports = router;
