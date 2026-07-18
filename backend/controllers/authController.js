import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { isAdminUser } from '../middleware/auth.js';

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    isAdmin: isAdminUser(user),
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

function getGoogleClient() {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new AppError('Google auth is not configured', 500);
  }

  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
}

async function findOrCreateGoogleUser(googlePayload) {
  const googleId = googlePayload.sub;
  const email = String(googlePayload.email || '').trim().toLowerCase();
  const name = String(googlePayload.name || googlePayload.given_name || email.split('@')[0] || 'Google User').trim();

  if (!googleId || !email) {
    throw new AppError('Invalid Google account data', 401);
  }

  if (googlePayload.email_verified !== true) {
    throw new AppError('Google email address is not verified', 401);
  }

  let user = await User.findOne({ googleId });

  if (!user) {
    user = await User.findOne({ email });
  }

  if (user) {
    let shouldSave = false;

    if (!user.googleId) {
      user.googleId = googleId;
      shouldSave = true;
    }

    if (!user.name || user.name.trim().length === 0) {
      user.name = name;
      shouldSave = true;
    }

    if (shouldSave) {
      await user.save();
    }

    return user;
  }

  return User.create({
    name,
    email,
    googleId,
  });
}

async function getGoogleUserInfoFromAccessToken(accessToken) {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new AppError('Unable to verify Google account', 401);
    }

    return response.json();
  } catch {
    throw new AppError('Unable to verify Google account', 401);
  }
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

export const googleLogin = asyncHandler(async (request, response) => {
  const credential = request.body?.credential || request.body?.idToken;
  const accessToken = request.body?.accessToken;

  if (!credential && !accessToken) {
    throw new AppError('Google credential is required', 400);
  }

  let payload;

  if (credential) {
    const googleClient = getGoogleClient();
    const ticket = await googleClient.verifyIdToken({
      idToken: String(credential),
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    payload = ticket.getPayload();
  } else {
    payload = await getGoogleUserInfoFromAccessToken(String(accessToken));
  }

  if (!payload) {
    throw new AppError('Unable to verify Google account', 401);
  }

  const user = await findOrCreateGoogleUser(payload);
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