import userPosts from "../models/postModels.js";

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

        await post.save()

        res.status(201).json({message: "Post created successfully"})


    } catch (error) {
        console.log("Error in userPostController.js userPostData ", error.message);
        res.status(500).json({ error: "Error in userPostController.js " })
    }  
}

const listPostData = async (req,res) =>{
    try {
        const userId = req.query.userId; // Get userId from query parameters
        let posts;

        if (userId) {
            posts = await userPosts.find({ userId: userId }); // Fetch posts for the specific user
        } else {
            posts = await userPosts.find(); // Fetch all posts if no userId is provided
        }

        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Server error" });
    }
}

const listLogedInUserPostData = async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const objectId = mongoose.Types.ObjectId.isValid(userId) ? mongoose.Types.ObjectId(userId) : null;
        
        if (!objectId) {
            return res.status(400).json({ error: "Invalid userId" });
        }

        const posts = await userPosts.find({ userId: objectId });

        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.log("Error in userPostController.js listLogedInUserPostData", error.message);
        res.status(500).json({ error: "Error in userPostController.js" });
    }
};


export { userPostData,listPostData,listLogedInUserPostData }