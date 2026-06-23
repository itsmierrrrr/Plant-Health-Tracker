import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT secret is not configured', 500);
  }

  return jwt.sign({ userId: user._id.toString(), email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export const register = asyncHandler(async (request, response) => {
  const { name, email, password } = request.body || {};

  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required', 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(String(password), 12);
  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = createToken(user);

  return sendSuccess(response, 201, 'Account created successfully', {
    data: {
      user: sanitizeUser(user),
      token,
    },
  });
});

export const login = asyncHandler(async (request, response) => {
  const { email, password } = request.body || {};

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatches = await bcrypt.compare(String(password), user.password);

  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = createToken(user);

  return sendSuccess(response, 200, 'Logged in successfully', {
    data: {
      user: sanitizeUser(user),
      token,
    },
  });
});

export const getCurrentUser = asyncHandler(async (request, response) => {
  return sendSuccess(response, 200, 'Current user retrieved successfully', {
    data: {
      user: sanitizeUser(request.user),
    },
  });
});

export const logout = asyncHandler(async (request, response) => {
  return sendSuccess(response, 200, 'Logged out successfully', {
    data: {
      loggedOut: true,
    },
  });
});