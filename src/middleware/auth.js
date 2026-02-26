import passport from 'passport';

/**
 * Middleware para autenticar usuario con JWT
 * Usa la estrategia JWT de Passport
 */
export const authenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, user, info) => {
        if (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Error de autenticación',
                error: error.message
            });
        }

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: info?.message || 'No autorizado: Token inválido o faltante'
            });
        }

        req.user = user;
        next();
    })(req, res, next);
};

/**
 * Middleware para verificar que el usuario es admin
 * Solo el administrador puede crear, actualizar y eliminar productos
 */
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'No autorizado: Autenticación requerida'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Prohibido: Se requiere rol de administrador'
        });
    }

    next();
};

/**
 * Middleware para verificar que el usuario es un usuario regular (no admin)
 * Solo el usuario puede agregar productos a su carrito
 */
export const isUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'No autorizado: Autenticación requerida'
        });
    }

    if (req.user.role !== 'user') {
        return res.status(403).json({
            status: 'error',
            message: 'Prohibido: Solo los usuarios pueden realizar esta acción'
        });
    }

    next();
};

/**
 * Middleware para verificar si el usuario es dueño del recurso o admin
 */
export const isOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'No autorizado: Autenticación requerida'
        });
    }

    const userId = req.params.id;

    if (req.user.role === 'admin' || req.user._id.toString() === userId) {
        return next();
    }

    return res.status(403).json({
        status: 'error',
        message: 'Prohibido: Solo puedes acceder a tus propios recursos'
    });
};
