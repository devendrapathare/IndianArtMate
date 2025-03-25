import userPosts from "../../person2/models/postModels.js";

function removeElement(array, elementToRemove) {
    return array.filter(item => item.toString() !== elementToRemove);
}

// Function to calculate and update likes/dislikes stats
async function calculateAndUpdateLikeDislikeStats(post) {
    const likeCount = post.like.length;
    const dislikeCount = post.disLike.length;
    const total = likeCount + dislikeCount;
    let ratio = 0;
    let rank = 0;

    if (total > 0) {
        ratio = (likeCount - dislikeCount) / total;
        rank = Math.round((ratio + 1) * 2.5); // Adjusting the ratio to fit within 0 to 5
    }

    post.likeDislikeRank = rank; // Updating the likeDislikeRank in DB
    await post.save();

    return { likeCount, dislikeCount, ratio, rank };
}

export const getAllLikesDislikesByPostId = async (req, res) => {
    const { postId } = req.query;
    try {
        const post = await userPosts.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const stats = await calculateAndUpdateLikeDislikeStats(post);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const for_like = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        const post = await userPosts.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        if (!post.like.includes(userId) && userId != null) {
            post.like.push(userId);
            post.disLike = removeElement(post.disLike, userId);
        } else if (post.like.includes(userId) && userId != null) {
            post.like = removeElement(post.like, userId);
        }

        const stats = await calculateAndUpdateLikeDislikeStats(post);
        res.status(200).json(stats);
        // console.log('stas',stats);
        
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const for_dislike = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        const post = await userPosts.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        if (!post.disLike.includes(userId) && userId != null) {
            post.disLike.push(userId);
            post.like = removeElement(post.like, userId);
        } else if (post.disLike.includes(userId) && userId != null) {
            post.disLike = removeElement(post.disLike, userId);
        }

        const stats = await calculateAndUpdateLikeDislikeStats(post);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};
