const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer"

    if (!token) {
        return res.status(403).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, 'CLIENT_SECRET_KEY', (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });
        req.user = user; // Attach user data to request
        console.log(req.user);
        console.log(token);
        
        
        next();
    });
};
// Middleware to authenticate and authorize users based on their roles
const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        const token = req.header('Authorization')?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
            req.user = decoded;

            if (req.user.role !== requiredRole) {
                return res.status(403).json({ error: 'Access denied. You do not have the required role.' });
            }
            console.log('Access given');
            
            next();
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(400).json({ error: 'Invalid token.' });
        }
    };
};

module.exports = {authenticateToken,authorizeRole};
