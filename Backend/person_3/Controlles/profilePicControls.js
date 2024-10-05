import User from '../../person2/models/userModels.js';

export const uploadProfilePic = async (req, res) => {
    console.log("upload-profile-pic me agya")
    try {
      const userId = req.params.id;
  
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const filePath = `/uploads/profilePic/${req.file.filename}`;
      // const filePath = `/uploads/${req.file.filename}`;
      
      const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: filePath }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Profile picture updated successfully', profilePic: filePath });
    } catch (error) {
      console.error('Error updating profile picture from ppc:', error); 
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  