import jwt from 'jsonwebtoken';

const AuthMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if( !authHeader || !authHeader.startsWith('Bearer ') ) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode.user;
    next();
  } catch(error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

export default AuthMiddleware;