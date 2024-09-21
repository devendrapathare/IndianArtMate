import Arti from '../../person2/models/userModels.js';

export const fetch_any_user_data_by_id = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await Arti.findById(userId);

        if (!user || user.length === 0) {
            return res.status(404).json({ message: "No user found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
}

export const update_profile =  async (req, res) => {
    const userId = req.params.id;
    const { userName, bio, mobile, email, addressLine1, addressLine2, profile_type } = req.body;
  
    try {
      const updatedUser = await Arti.findByIdAndUpdate(
        userId,
        {
          userName,
          bio,
          mobile,
          email,
          addressLine1,
          addressLine2,
          profile_type
        },
        { new: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
      console.error('Error updating profile:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }