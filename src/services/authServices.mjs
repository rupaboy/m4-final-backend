import User from "../models/userModel.mjs";
import Role from "../models/roleModel.mjs";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

class AuthService {
  async register(userData) {
    // Solo crea el usuario y devuelve token
    const user = new User(userData);
    await user.save();
    await user.populate('role');

    const userResponse = user.toObject();
    delete userResponse.password;

    const token = this.generateToken(user);
    return { user: userResponse, token };
  }

  generateToken(user) {
    return jwt.sign(
      {
        id: user._id,
        role: user.role.name || user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  async login(email, password) {
    const user = await User.findOne({ email }).populate('role');
    if (!user) throw new Error('Email or password invalid');

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error('Email or password invalid');

    const userResponse = user.toObject();
    delete userResponse.password;

    const token = this.generateToken(user);
    return { user: userResponse, token };
  }
}

export default new AuthService();
