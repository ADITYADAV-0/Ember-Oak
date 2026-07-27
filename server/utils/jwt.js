const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET || 'super_secret_jwt_key_ember_oak_2026',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
    const token = generateToken(user._id || user.id, user.role);

    const cookieOptions = {
        expires: new Date(
            Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRES_IN) || 7) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    };

    res.cookie('token', token, cookieOptions);

    res.status(statusCode).json({
        success: true,
        message,
        token,
        user: {
            id: user._id || user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            loyaltyPoints: user.loyaltyPoints || 0,
            joinDate: user.joinDate,
            preferences: user.preferences || [],
            dietary: user.dietary || [],
        },
    });
};

module.exports = {
    generateToken,
    sendTokenResponse,
};
