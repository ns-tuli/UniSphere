import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from './async.js';

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

// Grant access to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return next(new ErrorResponse('User role is not defined', 403));
        }

        // Check if any role of the user matches the authorized roles
        const isAuthorized = req.user.role.some(userRole => roles.includes(userRole));

        if (!isAuthorized) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role.join(', ')} is not authorized to access this route`,
                    403
                )
            );
        }

        next();
    };
};