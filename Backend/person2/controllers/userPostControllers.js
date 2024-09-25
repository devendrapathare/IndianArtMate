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

        const posts = await userPosts.find({})
        res.status(200).json({success:true,data:posts})
        
    } catch (error) {
        console.log("Error in userPostController.js listPostData", error.message);
        res.status(500).json({ error: "Error in userPostController.js " })
    }
}

const listLogedInUserPostData = async (req, res) => {
    try {
        const userId = req.params.userId;
        // const userId = "66e7e4093b0079974ff4dd57";
        // console.log("userback",userId);
        

        // Assuming userPosts is a model from your database
        const posts = await userPosts.find({ userId: userId });

        // Respond with the posts data
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.log("Error in userPostController.js listLogedInUserPostData", error.message);
        res.status(500).json({ error: "Error in userPostController.js" });
    }
};


export { userPostData,listPostData,listLogedInUserPostData }