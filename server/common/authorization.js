const createErr = require('http-errors');
const jwt = require('jsonwebtoken');
const R = require('ramda');
const db = require('../models/db');

module.exports = {
  isValid: async (req, res, next) => {
    if (R.isNil(req.headers.authorization)) {
      next(createErr(401, 'UNAUTHORIZED'));
      return;
    }

    const token = R.split(' ')(req.headers.authorization)[1];

    if (R.isNil(token)) {
      next(createErr(401, 'UNAUTHORIZED'));
    } else {
      const user = await jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
      );

      req.user = user;
      req.valid = true;

      next();
    }
  },

  checkPermission: async (req, res, next) => {
    if (req.valid) {
      const userid = parseInt(req.params.userid, 10);

      if (R.isNil(userid)) {
        next(createErr(400, 'BAD REQUEST'));
        return;
      }

      req.params.userid = userid;

      const filterUser = await db
        .get('users')
        .find({ id: userid })
        .value();

      if (R.isNil(filterUser)) {
        next(createErr(400, 'BAD REQUEST'));
        return;
      }

      if (
        R.and(
          !R.equals(filterUser.email, req.user.email),
          !R.equals(req.user.role, 'admin'),
        )
      ) {
        next(createErr(401, 'UNAUTHORIZED'));
        return;
      }

      req.userid = req.params.userid;

      next();
    } else next(createErr(400, 'BAD REQUEST'));
  },

  isAdmin: (req, res, next) => {
    if (R.equals(req.user.role, 'admin')) {
      next(createErr(401, 'UNAUTHORIZED'));
    } else next();
  },
};