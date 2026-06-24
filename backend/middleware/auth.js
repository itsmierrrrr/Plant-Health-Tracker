import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { User } from '../models/User.js';

function getTokenFromRequest(request) {
  const header = request.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return null;
  }

  return header.slice(7).trim();
}

export async function requireAuth(request, response, next) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    if (!process.env.JWT_SECRET) {
      throw new AppError('JWT secret is not configured', 500);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded?.userId || decoded?.sub;

    if (!userId) {
      throw new AppError('Invalid authentication token', 401);
    }

    const user = await User.findById(userId).select('name email createdAt updatedAt');

    if (!user) {
      throw new AppError('User not found', 401);
    }

    request.user = user;
    request.auth = {
      userId: user._id.toString(),
      token,
    };

    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Authentication required', 401));
  }
}