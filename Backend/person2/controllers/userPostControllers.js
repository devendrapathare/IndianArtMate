import userPosts from "../models/postModels.js";
import axios from "axios";

const userPostData = async (req,res) =>{

    let image_fileName = `${req.file.filename}`;

    const post = new userPosts({
        userId: req.body.userId,
        image: image_fileName,
        title: req.body.title,
        description: req.body.description,
        category :req.body.category,
        price: req.body.price
    })

    try {

        const savedPost = await post.save();

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            postId: savedPost._id 
        });


    } catch (error) {
        console.log("Error in userPostController.js userPostData ", error.message);
        res.status(500).json({success:false, error: "Error in userPostController.js " })
    }  
}

const listPostData = async (req,res) =>{
    try {
        const userId = req.query.userId; 
        let posts;

        if (userId) {
            posts = await userPosts.find({ userId: userId }); 
        } else {
            posts = await userPosts.find(); 
        }

        res.status(200).json({ success: true, data: posts });
        // console.log('posts',posts);
        
    } catch (error) {
        console.log("Error in userPostController.js listPostData", error.message);
        res.status(500).json({ error: "Error in userPostController.js " })
    }
}

const listLogedInUserPostData = async (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = await userPosts.find({ userId: userId });

        // Respond with the posts data
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.log("Error in userPostController.js listLogedInUserPostData", error.message);
        res.status(500).json({ error: "Error in userPostController.js" });
    }
};

const get_post_data_by_post_id = async(req,res)=>{
    try{
        const postID = req.params.id

        const posts = await userPosts.findById(postID);
        res.status(200).json({ success: true, data: posts });

    }catch (error) {
        console.log("Error in userPostController.js listLogedInUserPostData", error.message);
        res.status(500).json({ error: "Error in userPostController.js" });
    }
}

const get_post_data_by_name = async (req, res) => {
    try {
        const name = req.body.postName; 
        if (!name) {
            return res.status(400).json({ success: false, message: "Post name is required" });
        }

        console.log("Received postName:", name);
        const pythonResponse = await axios.get(`http://127.0.0.1:6000/search`, {
            params: { input_text: name },
        });

        const posts = pythonResponse.data.results; 

        if (!posts || posts.length === 0) {
            return res.status(404).json({ success: false, message: "No posts found" });
        }

        console.log("Posts found:", posts);
        res.status(200).json({ success: true, data: posts });

    } catch (error) {
        console.error("Error in getPostDataByName:", error.message);
        
        if (error.response) {
            return res.status(error.response.status).json({ success: false, error: error.response.data });
        }

        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

const deletePostById = async (req,res) => {
    
    const { id: postId } = req.params;

    try {

        const deletePost = await userPosts.findByIdAndDelete(postId);
        if (!deletePost) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Error in userPostController.js deletePostById: ", error.message);
        res.status(500).json({ error: "Error in userPostController.js " });
    }
    
}


export { userPostData,listPostData,listLogedInUserPostData ,get_post_data_by_post_id, deletePostById, get_post_data_by_name }
