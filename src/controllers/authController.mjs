//Authentication Controller
import AuthService from "../services/authServices.mjs";

export const register = async (req, res) => {
    try {
        const result = await AuthService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.log('Registration Error:', error);
        res.status(400).json({ message: error.message });
    }
}

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