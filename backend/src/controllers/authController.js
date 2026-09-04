const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt');
const { ApiError } = require('../middleware/errorHandler');

const register = async (req, res, next) => {
  try {
    const { email, password, full_name, bio, home_city_id } = req.body;

    if (!email || !password || !full_name) {
      throw new ApiError(400, 'email, password, and full_name are required');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const user = await User.create({
      _id: userId,
      email: email.toLowerCase(),
      password_hash,
      full_name,
      bio: bio || null,
      home_city_id: home_city_id || null,
      user_role: 'VISITOR',
    });

    const tokens = generateTokens(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          full_name: user.full_name,
          role: user.user_role,
        },
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const tokens = generateTokens(user);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          full_name: user.full_name,
          role: user.user_role,
        },
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ApiError(400, 'refreshToken is required');
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const tokens = generateTokens(user);

    res.status(200).json({
      success: true,
      data: { tokens },
    });
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired refresh token'));
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password_hash');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  getMe,
};
