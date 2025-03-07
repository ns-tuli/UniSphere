import asyncHandler from '../middlewares/async.js';
import User from '../models/user.js';
import ErrorResponse from '../utils/errorResponse.js';

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
};

// @desc Register User
// @route POST/api/v1/auth/register
// @public
export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    sendTokenResponse(user, 200, res);
});

// @desc LogIn User
// @route POST/api/v1/auth/login
// @public
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide an Email and a password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    const isMatched = await user.matchPassword(password);
    if (!isMatched) {
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc Get Current logged in User
// @route POST/api/v1/auth/me
// @private
export const getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc Log user out / clear cookie
// @route GET/api/v1/auth/logout
// @private
export const logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now()),  // Fixed missing parentheses
        httpOnly: true
    });
    
    res.status(200).json({
        success: true,
        data: {}
    });
});


