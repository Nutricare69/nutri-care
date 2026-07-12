import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// 🔒 STRICT LAYER: For changes requiring valid authentication (e.g., Generating plans, profile changes)
export const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Unauthorized: Missing authentication token" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id); // Matches config file token key
        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = await maintainUserQuota(user);
        next();
    } catch (error) {
        console.log("Error in strict isAuth middleware:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// 🟢 LENIENT LAYER: Specifically for getCurrentUser initialization loops (Stops red console logs!)
export const isAuthOptional = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        // No token present? Pass null downstream cleanly with NO console errors!
        if (!token) {
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            req.user = null;
            return next();
        }

        req.user = await maintainUserQuota(user);
        next();
    } catch (error) {
        // If a cookie token is expired or corrupted, invalidate it silently without crashing
        req.user = null;
        next();
    }
};

// Unified True 30-Day Rolling Window Maintenance Block
const maintainUserQuota = async (user) => {
    let requiresSave = false;
    const currentDate = new Date();

    if (user.isPremium && user.premiumValidUntil && user.premiumValidUntil < currentDate) {
        user.isPremium = false;
        requiresSave = true;
    }

    // 🟢 FIXED: Checks if a full 30 days have elapsed since their last generation milestone
    if (user.lastMealPlanDate) {
        const lastGenerated = new Date(user.lastMealPlanDate);
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

        if (currentDate - lastGenerated >= thirtyDaysInMs && user.freePlansUsedThisMonth > 0) {
            user.freePlansUsedThisMonth = 0;
            requiresSave = true;
        }
    }

    if (requiresSave) {
        await user.save();
    }
    return user;
};