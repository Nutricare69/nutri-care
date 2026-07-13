import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import generateToken from '../config/token.js';

// Regex Constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const NAME_REGEX = /^[A-Za-z\s]{2,}$/;

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Server-side Regex Validations
    if (!NAME_REGEX.test(name)) {
      return res.status(400).json({ message: "Invalid name. Use letters only (min 2 characters)." });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
      });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword
    });

    const token = await generateToken(newUser._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser
    });

  } catch (err) {
    return res.status(500).json({ message: `User creation failed ${err.message}` });
  }
};

export const login = async (req, res) => {
  try {
    // 1. Accept rememberMe from req.body
    const { email, password, rememberMe } = req.body;

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Username or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Username or password is incorrect" });
    }

    const token = await generateToken(user._id);

    // 2. Dynamic Cookie Lifespan Config
    // If rememberMe is false, omitting maxAge turns this into a transient "Session Cookie"
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    if (rememberMe) {
      cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days long lifespan
    }

    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      message: "User logged in successfully",
      user: user
    });
  } catch (err) {
    return res.status(500).json({ message: `Login failed ${err.message}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: `Logout failed ${err.message}` });
  }
};

// NEW: Password Update Controller Method
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Ensure user identity is extracted from request wrapper (via auth middleware)
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized profile action." });
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        message: "New password must be at least 8 characters long, contain an uppercase, lowercase, number, and special character."
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password verification failed." });
    }

    // Encrypt the approved new credentials
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    return res.status(500).json({ message: `Failed to update password: ${err.message}` });
  }
};