var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');


router.post('/login', authController.login);

router.post('/signin', authController.signin);

router.post('/logout', verifyToken, authController.logout);

function verifyToken(req, res, next) {
  const httpOnlyCookie = req.cookies.token;
  const jsonCookie = httpOnlyCookie ? JSON.parse(httpOnlyCookie) : {};

  if (jsonCookie.token) {
    const cookieToken = jsonCookie.token;
    // verify the token
    jwt.verify(cookieToken, process.env.SECRET, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.token = cookieToken;
        req.authData = authData;
      }
    });
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = router;
