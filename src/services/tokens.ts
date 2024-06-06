import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your_jwt_secret';
const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'your_jwt_access_secret';
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret';
const resetTokenSecret = process.env.JWT_RESET_SECRET || 'your_jwt_reset_secret';

// Generate Token
export const createToken = (user: any) => {
    return jwt.sign({ user }, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: any) => {
  return jwt.verify(token, secret);
};


export const createAccessToken = (payload: object, expiresIn: string = '15m') => {
  return jwt.sign(payload, accessTokenSecret, { expiresIn });
};

export const createRefreshToken = (payload: object, expiresIn: string = '7d') => {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, accessTokenSecret);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refreshTokenSecret);
};

export const createResetToken = (payload: object, expiresIn: string = '1h') => {
    return jwt.sign(payload, resetTokenSecret, { expiresIn });
  };

export const verifyResetToken = (token: string) => {
    return jwt.verify(token, resetTokenSecret);
  };