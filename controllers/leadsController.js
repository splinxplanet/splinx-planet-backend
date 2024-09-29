// controllers/leadController.js
const Lead = require('../models/LeadsGen');
const { Parser } = require('json2csv'); // Used for CSV export

// Submit lead data
exports.submitLead = async (req, res) => {
  try {
    const { source, fullName, emailAddress, phoneNumber } = req.body;

    // Create a new lead
    const lead = new Lead({
      source,
      fullName,
      emailAddress,
      phoneNumber
    });

    // Save lead to the database
    await lead.save();

    res.status(201).json({ message: 'Lead submitted successfully', lead });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting lead', error: error.message });
  }
};

// fetch all leads
exports.fetchLeads = async (req, res) => {
  try {
    const leads = await Lead.find({}); // Fetch all leads from the database
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leads', error: error.message });
  }
};  

// Download leads as CSV
exports.downloadLeadsCsv = async (req, res) => {
  try {
    const leads = await Lead.find({}); // Fetch all leads from the database

    // Convert leads to CSV
    const fields = ['source', 'fullName', 'emailAddress', 'phoneNumber', 'createdAt', 'updatedAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);

    // Set headers to force download of CSV file
    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading CSV', error: error.message });
  }
};
