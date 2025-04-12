import Arti from '../../person2/models/userModels.js';
import userPosts from "../../person2/models/postModels.js";
import axios from 'axios';
import mongoose from 'mongoose';


export const fetch_any_user_data_by_id = async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await Arti.findById(userId);

      if (!user) {
          return res.status(404).json({ success: false, message: "No user found" });
      }

      return res.status(200).json({ success: true, user });
  } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

export const update_profile = async (req, res) => {
  const userId = req.params.id;
  const { userName, bio, phoneNumber, email, addressLine1, addressLine2, profile_type } = req.body;

  try {
    const updatedUser = await Arti.findByIdAndUpdate(
      userId,
      {
        userName,
        bio,
        phoneNumber, //  Updated to match your schema
        email,
        addressLine1,
        addressLine2,
        profile_type,
        isUpdated: true
      },
      { new: true } // returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};





  export const fetch_all_users = async (req, res) => {
    try {
        const userId = req.body.userId;
        console.log("User ID from frontend:", userId);
        const response = await axios.get(`http://localhost:6000/recommend/${userId}`);
        if (response.status !== 200) {
            return res.status(500).json({ error: "Failed to fetch recommendations from Python server" });
        }

        if (!response.data.recommended_users || !Array.isArray(response.data.recommended_users)) {
            return res.status(500).json({ error: "Invalid response data from Python server" });
        }

        if (response.data.recommended_users.length === 0) {
            return res.status(200).json({ message: "No recommended users available" , user : [] });
        }

        const recommendedUserIds = response.data.recommended_users.map(id => new mongoose.Types.ObjectId(id));
        
        const currentUser = await Arti.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const respectingIds = currentUser.respecting.map(id => id.toString()); // Convert to string for comparison
        
        const filteredUserIds = recommendedUserIds.filter(id => !respectingIds.includes(id.toString()));

        const recommendedUsers = await Arti.find({ _id: { $in: filteredUserIds } });

        if (!recommendedUsers.length) {
            return res.status(200).json({ message: 'No new recommended users found', user : [] });
        }
        
        res.status(200).json({ message: 'Users fetched', user: recommendedUsers });
    } catch (e) {
        console.error('Cannot find user:', e);
        res.status(500).json({ message: 'Cannot find user' });
    }
};


    
export  const fetchPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

      if (!userId) {
          return res.status(400).json({ error: "userId is required" });
      }


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


export const user_recommendation = async (req, res) => {
  const cookies = req.cookies;
console.log("Raw cookies:", cookies);

const userInfoString = cookies["user-info"];  // Get the string
if (!userInfoString) {
  return res.status(400).json({ error: "User info cookie not found" });
}

try {
  const userInfo = JSON.parse(decodeURIComponent(userInfoString)); // Parse JSON
  console.log("Parsed userInfo:", userInfo);

  if (!userInfo._id) {
    return res.status(400).json({ error: "User ID not found in cookies" });
  }

  const userId = userInfo._id;
  const response = await axios.get(`http://localhost:6000/recommend/${userId}`);

  if (response.status !== 200) {
    return res.status(500).json({ error: "Failed to fetch recommendations from Python server" });
  }

  const recommendedUserIds = response.data;
  const recommendedUsers = await Arti.find({ _id: { $in: recommendedUserIds } });

  res.status(200).json({ success: true, users: recommendedUsers });
} catch (error) {
  console.error("Error parsing user-info cookie:", error);
  res.status(400).json({ error: "Invalid cookie format" });
}

};




// try{
//   const all_user_data = await Arti.find();

//   if (!all_user_data) {
//     return res.status(404).json({ message: 'Users not found' });
//   }
//   res.status(200).json({ message: 'users feched' ,user:all_user_data});
  
// }catch(e){
//   console.error('can not find user:', e);
//   res.status(500).json({ message: 'can not find user' });
// }