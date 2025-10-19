const jwt = require('jsonwebtoken');




exports.verifyToken = (req, res, next) => {
    try {
        console.log('authorization header:', req.headers.authorization);
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            throw new Error('Token verification failed');
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};