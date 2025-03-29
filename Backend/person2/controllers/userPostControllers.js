import userPosts from "../models/postModels.js";
import axios from "axios";
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';


const userPostData = async (req, res) => {

    let image_fileName = `${req.file.filename}`;


    // ⭐ NEW: Image hash generation and duplicate check logic
    let imagePath = path.join('uploads', image_fileName); // Adjust path if needed

    let imageBuffer;
    try {
        imageBuffer = fs.readFileSync(imagePath);
    } catch (err) {
        return res.status(400).json({ success: false, message: "Error reading image file" });
    }

    const hash = crypto.createHash('sha256').update(imageBuffer).digest('hex');

    const existingPost = await userPosts.findOne({ imageHash: hash });

    if (existingPost) {
        return res.status(409).json({ success: false, message: "Similar artwork already exists." });
    }


    const post = new userPosts({
        userId: req.body.userId,
        image: image_fileName,
        imageHash: hash, // ⭐ NEW: hash added here
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price
    });



    const pythonResponse = await axios.post('http://127.0.0.1:6000/nlp/post_data', post);
    console.log("pythonResponse.data.status:", pythonResponse.data.status)


    try {

        const savedPost = await post.save();

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            postId: savedPost._id
        });


    } catch (error) {
        console.log("Error in userPostController.js userPostData ", error.message);
        res.status(500).json({ success: false, error: "Error in userPostController.js " })
    }
}

const listPostData = async (req, res) => {
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

const get_post_data_by_post_id = async (req, res) => {
    try {
        const postID = req.params.id

        const posts = await userPosts.findById(postID);
        res.status(200).json({ success: true, data: posts });

    } catch (error) {
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
        const pythonResponse = await axios.get('http://127.0.0.1:6000/nlp/search', {

            params: { input_text: name },

        });

        const pythonData = typeof pythonResponse.data === "string" ? JSON.parse(pythonResponse.data) : pythonResponse.data;
        console.log("Parsed Python response:", (pythonData.results));


        res.status(200).json({ success: true, data: pythonResponse.data.results });

    } catch (error) {
        console.error("Error in getPostDataByName:", error.message);

        if (error.response) {
            return res.status(error.response.status).json({ success: false, error: error.response.data });
        }

        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

const deletePostById = async (req, res) => {
    const { id: postId } = req.params;

    try {
        // Delete from MongoDB first
        const deletePost = await userPosts.findByIdAndDelete(postId);
        if (!deletePost) {
            return res.status(404).json({ error: "Post not found in MongoDB" });
        }

        // Then, delete from the Python NLP system
        const pythonResponse = await axios.delete('http://127.0.0.1:6000/nlp/delete', {
            params: { post_id: postId },
        });

        res.status(200).json({
            success: true,
            message: "Post deleted from MongoDB and CSV",
            pythonData: pythonResponse.data
        });

    } catch (error) {
        console.error("Error in userPostController.js deletePostById: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export { userPostData, listPostData, listLogedInUserPostData, get_post_data_by_post_id, deletePostById, get_post_data_by_name }


// functions for python api

// const sendPostDataToPython = async (req, res , post_data) => {
//     try {
//         // const postData = {
//         //     userId: req.body.userId,
//         //     image: req.body.image,
//         //     title: req.body.title,
//         //     description: req.body.description,
//         //     category: req.body.category,
//         //     price: req.body.prices
//         // };

//         const pythonResponse = await axios.post('http://127.0.0.1:6000/post_data', postData);

//         res.status(200).json({ success: true, data: pythonResponse.data });

//     } catch (error) {
//         console.error("Error in sendPostDataToPython:", error.message);

//         if (error.response) {
//             return res.status(error.response.status).json({ success: false, error: error.response.data });
//         }

//         res.status(500).json({ success: false, error: "Internal server error" });
//     }
// };
