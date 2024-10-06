import hireModel from "../models/Hiring.js";

const applyHire = async (req, res) => {
    try {
        // console.log("bofy", req.body);
        
        const { HiringData } = req.body;

        if (!HiringData) {
            return res.status(400).json({ success: false, message: "HiringData is required." });
        }

        const newHire = new hireModel({
            ProjectOwnerId: HiringData.ProjectOwnerId,
            ContributerId: HiringData.ContributerId,
            ProjectOwnerDetails: HiringData.ProjectOwnerDetails,
            ContributerDetails: HiringData.ContributerDetails,
        });

        await newHire.save();
        res.status(201).json({ success: true, message: "Hire applied successfully." });
    } catch (error) {
        console.error("Error applying For Hire:", error); 
        res.status(500).json({ success: false, message: "Backend Error" });
    }
};

const fetchHiringData = async (req, res) => {
    try {
        const ContributerId = req.params.userId;
        // console.log("userId",ContributerId);
        let HiringData = await hireModel.find({ContributerId})
        res.status(200).json({success:true,message: "Cart data fetched successfully",HiringData})
        // console.log("HiringData",HiringData);
        
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
        console.log(error);
    }
}

const updataHiring = async (req, res) => {
    try {
        // console.log(req.body);
        
        const updatadHireStatus = await hireModel.findByIdAndUpdate(req.body.HireId, { hiringState: req.body.hiringState });
        console.log("staus",updatadHireStatus);
        res.status(200).json({ success: true, message: "Hire status updated successfully"})

        if (req.body.hiringState==="Reject") {
            await hireModel.findByIdAndDelete(updatadHireStatus._id);
            console.log("Rejected Successfully:"); 
        }
        
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
        console.log(error);
    }    
}

export { applyHire ,fetchHiringData,updataHiring};
