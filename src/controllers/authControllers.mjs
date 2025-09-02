//Authentication Controller
import AuthService from "../services/authServices.mjs";

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

        // Avoid duplicates
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(422).json({ success: false, message: 'Email already in use' });

        const existingUsername = await User.findOne({ username });
        if (existingUsername) return res.status(422).json({ success: false, message: 'Username already in use' });

        // Default role
        const defaultRole = await Role.findOne({ name: 'user' });
        if (!defaultRole) return res.status(422).json({ success: false, message: 'Default user role not specified' });

        // Hash pass
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword, location, role: defaultRole._id });
        await user.save();
        await user.populate('role');

        const userResponse = user.toObject();
        delete userResponse.password;

        const token = AuthService.generateToken(user);

        return res.status(201).json({ success: true, message: `User "${username}" created successfully`, user: userResponse, token });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ success: false, title: 'Server error', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await AuthService.login(email,password);
        res.json(result);
    } catch (error) {
        console.log('Login Error:', error);
        res.status(401).json({ message: error.message });
    }
}