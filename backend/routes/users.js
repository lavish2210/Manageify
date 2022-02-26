const express = require("express");
const { body } = require("express-validator");

const isAuth = require("../middleware/isAuth");
const usersController = require("../controllers/users");

const router = express.Router();

const emailValidator = body("email")
  .isEmail()
  .normalizeEmail()
  .withMessage("Email Address is not valid.");
const passwordValidator = body("password")
  .trim()
  .isLength({ min: 6 })
  .withMessage("Password has to be 6 chars or more.");
const nameValidator = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required.");

// POST /users/login
router.post(
  "/login",
  [emailValidator, passwordValidator],
  usersController.login
);

// POST /users/logout
router.post("/logout", isAuth, usersController.logout);

// GET /users/account
router.get("/account", isAuth, usersController.getUser);

module.exports = router;
