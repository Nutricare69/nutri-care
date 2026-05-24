import User from "../models/user.model.js";
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: `Error fetching user ${error}` });
    }
}

export const completeProfile = async (req,res)=>{
  try{

    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        dateOfBirth:req.body.dateOfBirth,
        profileCompleted:true
      },
      {new:true}
    );

    res.status(200).json({
      message:"Profile completed",
      user:updatedUser
    });

  }catch(error){
    console.error("Profile update error:", error);
    res.status(500).json({
      message:"Error updating profile"
    });

  }
}