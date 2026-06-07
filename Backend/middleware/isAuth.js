import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Ensure you import the User model

export const isAuth = async (req, res, next) => {
    try {
        // 1. (Your existing code) Token verification logic...
        const token = req.cookies.token; // or req.headers.authorization...
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 2. Fetch the user
        const user = await User.findById(decoded.id || decoded._id);
        if (!user) return res.status(401).json({ message: "User not found" });

        // --- NEW: SUBSCRIPTION & QUOTA MAINTENANCE ---
        let requiresSave = false;
        const currentDate = new Date();

        // A. Check Premium Expiry
        if (user.isPremium && user.premiumValidUntil && user.premiumValidUntil < currentDate) {
            user.isPremium = false; // Downgrade
            requiresSave = true;
        }

        // B. Reset free plan counter if it's a new month
        if (user.lastMealPlanDate && user.lastMealPlanDate.getMonth() !== currentDate.getMonth()) {
            user.freePlansUsedThisMonth = 0;
            requiresSave = true;
        }

        // C. Save if any maintenance changes were made
        if (requiresSave) {
            await user.save();
        }
        // ---------------------------------------------

        // 3. Attach the fresh, accurate user object to the request
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in isAuth middleware", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default isAuth;