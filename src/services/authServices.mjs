import User from "../models/userModel.mjs";
import Role from "../models/roleModel.mjs";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

class AuthService {

    async register(userData) {
        //Username 'admin' reserved for administrator
        if (userData.username.toLowerCase() === 'admin') {
            throw new Error(`Username ${userData.username} is not available`)
        }
        //Checking user/email existences
        const existingUser = await User.findOne({
            $or: [
                { email: userData.email },
                { username: userData.username }
            ]
        });

        if (existingUser) {
            throw new Error('User or email already in use')
        }
        //Bcrypt
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        //Roles And Permissions
        const defaultRole = await Role.findOne({ name: 'user' })
        if (!defaultRole) {
            throw new Error('Default user role not specified!');
        }

        //New User instance
        const user = new User({
            ...userData,
            password: hashedPassword,
            role: defaultRole._id
        });

        await user.save();
        await user.populate('role')

        //From mongoose Obj to plain Obj
        const userResponse = user.toObject();
        //delete password Temp value
        delete userResponse.password

        //Token JWT
        const token = this.generateToken(user);

        return { user: userResponse, token }
    }

    async login(email, password) {
        //Find user by email
        const user = await User.findOne({ email }).populate('role');
        if (!user) {
            throw new Error('Email or password invalid')
        }
        //Password Verification
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Email or password invalid');
        }

        //from Mongoose OBJ to Plain OBJ
        const userResponse = user.toObject();
        delete userResponse.password;

        //Returning New Token and user OBJ
        const token = this.generateToken(user);
        return { user: userResponse, token };
    }

    generateToken(user) {
        //Token w/ id & role
        return jwt.sign(
            {
                id: user._id,
                role: user.role.name || user.role,
            },
            //secret .env keyword
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }
}

export default new AuthService()