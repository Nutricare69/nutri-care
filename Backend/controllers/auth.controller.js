import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import generateToken from '../config/token.js';


export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword
    })

    const token = await generateToken(newUser._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000

    })
    return res.status(201).json({
      message: "User created successfully",
      user: newUser
    })

  } catch (err) {
    return res.status(500).json({ message: `User creation failed ${err}` });
  }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(400).json({ message: "username or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password) //have to understand this line

    if (!isMatch) {
      return res.status(400).json({ message: "username or password is incorrect" });
    }

    const token = await generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(201).json({
      message: "User logged in successfully",
      user: user
    })
  } catch (err) {
    return res.status(500).json({ message: `login failed ${err}` });
  }
}

export const logOut = async (req, res) => {
  try {
    res.cookie("token")
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: `Logout failed ${err}` });
  }
}
