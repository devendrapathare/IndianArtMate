import userPosts from "../../person2/models/postModels.js";

function removeElement(array, elementToRemove) {
    array.forEach((item, index) => {
        console.log("item", item.toString());
        console.log("ele", elementToRemove);
        
        if (item.toString() === elementToRemove) {
            array.splice(index, 1);
            console.log("index:", index);
        }
        console.log("im out");
    });
    return array;
}

export const for_like = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        const post = await userPosts.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (!post.like.includes(userId) && userId != null) {
            console.log("here i m !");
            post.like.push(userId);
            if (post.disLike.includes(userId)) {
                console.log("imhere in 1");
                removeElement(post.disLike, userId);
                console.log("post_dis:", post.disLike);
            }
        } else if (post.like.includes(userId) && userId != null) {
            removeElement(post.like, userId);
            console.log("okokk:", post.like);
        }
        
        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const for_dislike = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        const post = await userPosts.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (!post.disLike.includes(userId) && userId != null) {
            console.log("User disliked the post");
            post.disLike.push(userId);
            if (post.like.includes(userId)) {
                console.log("User had liked the post, removing the like");
                removeElement(post.like, userId);
                console.log("Updated likes:", post.like);
            }
        } else if (post.disLike.includes(userId) && userId != null) {
            console.log("User is removing their dislike");
            removeElement(post.disLike, userId);
            console.log("Updated dislikes:", post.disLike);
        }

        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
