const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs'); // Added missing import

exports.register = async (req, res, next) => {
  try {
    const { email, password, name, phone, role, shopId } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return next(new ApiError(400, 'Email already in use'));
    }

    const user = await User.create(email, password, name, phone, role || 'client', shopId || null);
    const token = generateToken({ userId: user.id });

    res.status(201).json({
      success: true,
      data: user,
      token: token
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Please provide email and password'));
    }

    const user = await User.findByEmail(email);
    
    // Use bcrypt to compare password
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return next(new ApiError(401, 'Invalid credentials'));
    }

    const token = generateToken({ userId: user.id });

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        shopId: user.shop_id
      },
      token: token
    });
  } catch (err) {
    next(err);
  }
};

// The missing function that caused the crash
exports.getMe = async (req, res, next) => {
  try {
    // req.user is attached by the auth middleware
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};