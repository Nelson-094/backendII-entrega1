import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import { config } from './config.js';

// JWT Strategy options
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
};

/**
 * JWT Strategy for authentication
 * This strategy validates the JWT token and retrieves the user
 */
passport.use('jwt', new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        // Find user by ID from token payload
        const user = await User.findById(payload.id).populate('cart');

        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        // Return user object
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

/**
 * "Current" Strategy - validates logged user and extracts data from JWT
 * This is used specifically for the /api/sessions/current endpoint
 */
passport.use('current', new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        // Find user by ID from token payload
        const user = await User.findById(payload.id)
            .select('-password')
            .populate('cart');

        if (!user) {
            return done(null, false, { message: 'Invalid token: User not found' });
        }

        // Return user data without password
        return done(null, {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart
        });
    } catch (error) {
        return done(error, false, { message: 'Error validating token' });
    }
}));

export default passport;
