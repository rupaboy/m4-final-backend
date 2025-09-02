import AuthService from "../services/authServices.mjs";
import User from '../models/userModel.mjs';
import Role from "../models/roleModel.mjs";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { username, email, password, location } = req.body;

    if (!username || !email || !password) {
      return res.status(422).json({ success: false, message: 'Username, email and password are required' });
    }

    // Username reserved
    if (username.toLowerCase() === 'admin') {
      return res.status(422).json({ success: false, message: 'Username "admin" is not available' });
    }

    // Validate duplicates
    if (await User.findOne({ email })) {
      return res.status(422).json({ success: false, message: 'Email already in use' });
    }
    if (await User.findOne({ username })) {
      return res.status(422).json({ success: false, message: 'Username already in use' });
    }

    // Default role
    const defaultRole = await Role.findOne({ name: 'user' });
    if (!defaultRole) {
      return res.status(422).json({ success: false, message: 'Default user role not specified' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userData = { username, email, password: hashedPassword, location, role: defaultRole._id };
    const result = await AuthService.register(userData);

    return res.status(201).json({
      success: true,
      message: `User "${username}" created successfully`,
      ...result
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, title: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    return res.json(result);
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(401).json({ message: error.message });
  }
};
