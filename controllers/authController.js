const User = require('../models/user');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dayjs = require("dayjs");

exports.login = [
  body('login')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Login must be specified')
    .isLength({ max: 25 })
    .withMessage('Login must be less than 25 characters long')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password must be specified')
    .isLength({ max: 30 })
    .withMessage('Password must be less than 30 characters long')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(403).json({ errors: errors.array() });
    }
    else {
      const user = await User.findOne({ 'username': req.body.login }).exec();
      if (!user) {
        res.status(404).json({
          "errors": {
            "msg": "No user found with this login",
            "path": "login"
          }
        });
      }
      else {
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
          res.status(401).json({
            "errors": {
              "msg": "Password does not match",
              "path": "password"
            }
          });
        }
        else {
          // send back the JWT
          const expirationDate = dayjs().add(2, "days").toDate(); // if updated, the 'expiresIn' value below must be updated
          jwt.sign({ user }, process.env.SECRET, { expiresIn: "2d" }, (err, token) => {
            res.cookie("token", JSON.stringify({ token: token }), {
              secure: process.env.NODE_ENV !== "development",
              httpOnly: true,
              expires: expirationDate,
              sameSite: "none"
            });

            res.json({ result: true });
          });
        }
      }
    }
  })
];

exports.signin = [
  body('firstname')
    .trim()
    .isLength({ max: 25 })
    .withMessage('Firstname must be less than 25 characters long')
    .escape(),
  body('lastname')
    .trim()
    .isLength({ max: 25 })
    .withMessage('Lastname must be less than 25 characters long')
    .escape(),
  body('login')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Login must be specified')
    .isLength({ max: 25 })
    .withMessage('Login must be less than 25 characters long')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Password must be specified')
    .isLength({ max: 30 })
    .withMessage('Password must be less than 30 characters long')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(403).json({ errors: errors.array() });
    }
    else {
      const alreadyExistingUser = await User.findOne({ 'username': req.body.login }).exec();
      if (alreadyExistingUser) {
        res.status(401).json({
          "errors": {
            "msg": "Login already used",
            "path": "login"
          }
        });
      }
      else {
        const user = new User({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.login,
          password: '',
        });

        user.password = await bcrypt.hash(req.body.password, 10);
        await user.save();
        res.json({ result: true });
      }
    }
  })
];

exports.logout = asyncHandler(async (req, res, next) => {
  const expirationDate = dayjs().add(5, "seconds").toDate(); // if updated, the 'expiresIn' value below must be updated
  res.cookie("token", JSON.stringify({ token: "none" }), {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    expires: expirationDate,
  });

  res.json({ result: true });
});