import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    // 🟢 FIXED: Safety verification parameters moved to top to prevent property reading crashes
    if (!req.user || !req.user._id) {
      return res.status(200).json(null);
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(200).json(null);
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error inside getCurrentUser handler:", error);
    return res.status(200).json(null); // Fallback protects system against browser logs
  }
};

export const completeProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        dateOfBirth: req.body.dateOfBirth,
        profileCompleted: true
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Profile completed",
      user: updatedUser
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Error updating profile" });
  }
};