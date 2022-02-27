const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Input validation failed.");
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      const err = new Error("An user with this email could not be found.");
      err.statusCode = 404;
      throw err;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const err = new Error("Wrong password.");
      err.statusCode = 401;
      throw err;
    }
    sessionStorage.push({userId : user._id});
    res.status(201).json({
      message: "User successfully logged in.",
      userId: user._id.toString(),
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    const err = new Error("User is not authenticated.");
    err.statusCode = 401;
    throw err;
  }

  sessionStorage.clear("userId");
  res.status(200).json({
    message: "User successfully logged out.",
    userId: userId,
  });
};

const getUser = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!userId || !user) {
      const err = new Error("User is not authenticated.");
      err.statusCode = 401;
      throw err;
    }

    res.status(200).json({
      message: "User successfully fetched.",
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      pages: user.pages,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = login;
exports.logout = logout;
exports.getUser = getUser;
