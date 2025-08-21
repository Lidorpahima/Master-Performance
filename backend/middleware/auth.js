import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  
  try {
    const authHeader = req.header('Authorization') || req.header('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const normalizedId = decoded.id || decoded._id || decoded.userId;
    req.user = {
      ...decoded,
      id: normalizedId,
      _id: normalizedId,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
};

export const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {

    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};