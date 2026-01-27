import passport from 'passport';

/**
 * Middleware to authenticate user using JWT
 * Uses Passport JWT strategy
 */
export const authenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, user, info) => {
        if (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Authentication error',
                error: error.message
            });
        }

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: info?.message || 'Unauthorized: Invalid or missing token'
            });
        }

        req.user = user;
        next();
    })(req, res, next);
};

/**
 * Middleware to check if user has admin role
 */
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized: Authentication required'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Forbidden: Admin access required'
        });
    }

    next();
};

/**
 * Middleware to check if user can access resource
 * User can access their own resources or admin can access all
 */
export const isOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized: Authentication required'
        });
    }

    const userId = req.params.id;

    if (req.user.role === 'admin' || req.user._id.toString() === userId) {
        return next();
    }

    return res.status(403).json({
        status: 'error',
        message: 'Forbidden: You can only access your own resources'
    });
};
