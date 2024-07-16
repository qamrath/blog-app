import jwt from 'jsonwebtoken';
import { secret } from '../config/auth.js';

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, secret);
        req.user = { userId: decodedToken.id, email: decodedToken.email };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
}

export { authMiddleware };
