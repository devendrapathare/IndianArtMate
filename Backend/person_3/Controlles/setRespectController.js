import User from "../../person2/models/userModels.js";
import mongoose from "mongoose";

export const setRespect = async (req, res) => {
    const { loggedInUserId } = req.params;  
    const { userId } = req.body;            

    try {
        if (!mongoose.Types.ObjectId.isValid(loggedInUserId)) {
            return res.status(400).json({ message: "Invalid loggedInUserId" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        const loggedInUser = await User.findById(loggedInUserId);
        if (!loggedInUser) {
            return res.status(404).json({ message: "Logged-in user not found" });
        }

        const userGettingRespect = await User.findById(userId);
        if (!userGettingRespect) {
            return res.status(404).json({ message: "User to respect not found" });
        }

        const hasRespected = loggedInUser.respecting.includes(userId);

        if (hasRespected) {
            loggedInUser.respecting = loggedInUser.respecting.filter(id => id.toString() !== userId);
            userGettingRespect.respectors = userGettingRespect.respectors.filter(id => id.toString() !== loggedInUserId);
            await loggedInUser.save();
            await userGettingRespect.save();
            return res.status(200).json({ message: "Respect removed" });
        } else {
            loggedInUser.respecting.push(userId);
            userGettingRespect.respectors.push(loggedInUserId);
            await loggedInUser.save();
            await userGettingRespect.save();
            return res.status(200).json({ message: "Respect added" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
