import jwt from 'jsonwebtoken';


// Helper function to get user data and return a token
export const generateToken = (user) => {
        return jwt.sign(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET || 'somethingsecret',
            {
                expiresIn: '30d',
            }
        );
    };