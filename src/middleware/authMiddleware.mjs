import jwt from 'jsonwebtoken';
import User from '../models/userModel.mjs'
import RadioMarker from '../models/radioMarkerModel.mjs';
import { findRoleByName } from '../services/roleServices.mjs'

//Authentication Token Verifier

export const authenticateToken = (req, res, next) => {
    //req.headers
    const authHeader = req.headers['authorization'];
    //Extract token ("Bearer <token>" format)
    const token = authHeader && authHeader.split(' ')[1];

    //If no token, gets 401 (unauthorized)
    if (!token) {
        return res.status(401).json({ message: 'Unprovided Token' });
    }

    try {
        //Secret Key Token Verification
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //We save user info in req. OBJ
        req.user = decoded;
        //Next
        next();
    } catch (error) {
        // Invalid Token
        return res.status(403).json({ message: 'Invalid Token ' });

    }
};

const radioPermissions = ['update:radios', 'delete:radios', 'read:radios'];

export const hasPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: 'Not Authenticated'
                });
            }

            const user = await User.findById(req.user.id)

            if (!user) {
                return res.status(404).json({ message: "Token invalid. Are you logged in?" });
            }

            const role = await findRoleByName(req.user.role);

            if (!role) {
                return res.status(404).json({ message: 'User role corrupted' })
            }

            const isAdmin = role.name === 'admin';
            //console.log(role.name)

            const selfRestricted = [
                'read:users',
                'update:users',
                'delete:users',
                'create:radios',
                'read:radios',
                'update:radios',
                'delete:radios',
            ];

            //Block edition of role for common user:
            if (requiredPermission === 'update:users' && !isAdmin) {
                if (req.body.role) {
                    delete req.body.role;
                }
            }
            if (isAdmin) return next();

            if (selfRestricted.includes(requiredPermission)) {
                if (radioPermissions.includes(requiredPermission)) {
                    const marker = await RadioMarker.findById(req.params.id);
                    if (marker.user.toString() !== req.user.id) {
                        return res.status(403).json({
                            message: 'You can only update your own radio markers'
                        });
                    }
                    return next();
                }
                if (req.params.id && req.params.id !== req.user.id) {
                    return res.status(403).json({
                        message: 'You can only perform this action on your own account'
                    });
                }
                return next();
            }
            const hasPermission = role.permissions.some(
                p => p.name === requiredPermission
            );
            if (!hasPermission) {
                return res.status(403).json({
                    message: 'You have no permissions for this action'
                });
            }
            next();

        } catch (error) {
            next(error);
        }
    };
};