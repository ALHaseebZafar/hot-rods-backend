const express = require('express');

const ContactUs = require('../models/contactUs'); // Adjust path as needed
const router = new express.Router();


// Create a ContactUs submission (POST request)
router.post('/contactus', async (req, res) => {
  try {
    const { fullname, email, question } = req.body;

    // Validate request data
    if (!fullname || !email) {
      return res.status(400).json({ message: 'Full name and email are required' });
    }

    // Create a new contact submission
    const contactUs = new ContactUs({
      fullname,
      email,
      question
    });

    // Save to MongoDB
    await contactUs.save();
    res.status(201).json(contactUs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all ContactUs submissions (GET request)
router.get('/contactus', async (req, res) => {
  try {
    const contactUs = await ContactUs.find();
    res.status(200).json(contactUs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Delete a ContactUs submission (DELETE request)
router.delete('/contactus/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find and delete the contact
      const contactUs = await ContactUs.findByIdAndDelete(id);
      
      if (!contactUs) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      
      res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });


module.exports = router;
