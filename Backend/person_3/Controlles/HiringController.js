import Hiring from '../models/Hiring.js'

export const hire = async (req, res) => {
    const { ownerId, receiverId } = req.body;
  
    // Validate owner ID
    if (!ownerId) {
      return res.status(400).json({ success: false, message: 'Owner ID is required.' });
    }
  
    // Validate receiver ID
    if (!receiverId) {
      return res.status(400).json({ success: false, message: 'Receiver ID is required.' });
    }
  
    // Check if the owner is not trying to hire themselves
    if (ownerId === receiverId) {
      return res.status(400).json({ success: false, message: 'You cannot hire yourself.' });
    }
  
    try {
      // Proceed to create hiring request...
      const newHiring = new Hiring({
        ownerId,
        receiverId,
        hiringState: 'active',
      });
  
      const savedHiring = await newHiring.save();
  
      res.status(201).json({ success: true, data: savedHiring });
    } catch (error) {
      console.error('Error creating hiring:', error);
      res.status(500).json({ success: false, message: 'Server error.' });
    }
  };