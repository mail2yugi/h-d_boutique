import jwt from 'jsonwebtoken';

export const generateToken = (payload: { id: string; email: string; role: 'user' | 'admin' }): string => {
  const secret = process.env.JWT_SECRET || 'secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(payload, secret, { expiresIn } as any);
};

export const verifyToken = (token: string) => {
  try {
    const secret = process.env.JWT_SECRET || 'secret';
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
