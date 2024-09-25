import Arti from '../../person2/models/userModels.js';
import userPosts from "../../person2/models/postModels.js";


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

export const fetch_all_users = async(req,res)=>{

    try{
      const all_user_data = await Arti.find();

      if (!all_user_data) {
        return res.status(404).json({ message: 'Users not found' });
      }
      res.status(200).json({ message: 'users feched' ,user:all_user_data});
      
    }catch(e){
      console.error('can not find user:', e);
      res.status(500).json({ message: 'can not find user' });
    }

}

export  const fetchPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

      if (!userId) {
          return res.status(400).json({ error: "userId is required" });
      }

      // const objectId = mongoose.Types.ObjectId.isValid(userId) ? mongoose.Types.ObjectId(userId) : null;

      // if (!objectId) {
      //     return res.status(400).json({ error: "Invalid userId format" });
      // }

      const posts = await userPosts.find({ userId: userId });

      if (posts.length === 0) {
          return res.status(200).json({ success: false, message: "No posts found for this user" });
      }

      res.status(200).json({ success: true, data: posts });
  } catch (error) {
      console.error("Error in fetchPostsByUserId:", error.message);
      res.status(500).json({ error: "Server error" });
  }
};

