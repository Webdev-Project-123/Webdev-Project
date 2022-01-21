const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../models/db');

var listRefreshToken = [];

module.exports = {
  signup: async (body) => {
    if (!body.name || !body.email || !body.name) {
      return {
        error: true,
        msg: 'Invalid request',
      };
    }

    const users = await db.get('users').value();
    const filterUser = await users.filter((user) => user.email === body.email);

    if (filterUser.length > 0) {
      return {
        error: true,
        msg: 'Email is already existed',
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(body.password, salt);
    const objectUser = {
      id: users.length + 1,
      name: body.name,
      email: body.email,
      password: hashPassword,
      phone: '',
      address: '',
      avatar: '', // chưa làm
      role: 'user',
      cart: [],
      bought: [],
    };

    await db.get('users').push(objectUser).write();

    return {
      error: false,
      msg: 'Success',
    };
  },
  login: async (body) => {
    const users = await db.get('users').value();
    const filterUser = await users.filter((user) => user.email === body.email);
    if (filterUser.length === 1) {
      const cmpResult = await bcrypt.compare(body.password, filterUser[0].password);

      if (cmpResult.err) {
        return {
          error: true,
          msg: cmpResult.err,
        };
      }

      if (cmpResult) {
        const payload = {
          username: filterUser[0].username,
          email: filterUser[0].email,
          role: filterUser[0].role,
        };

        const accessToken = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
        const refreshToken = await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '24h' });
        listRefreshToken.push(refreshToken);
        return {
          accessToken,
          refreshToken,
          error: false,
          msg: 'OK',
          statusCode: 200,
        };
      }

      if (!cmpResult) {
        return {
          error: true,
          msg: 'Wrong password or email address',
        };
      }
    } else if (filterUser.length === 0) {
      return {
        error: true,
        msg: 'Wrong password or email address',
      };
    }

    return {
      error: true,
      msg: 'Error in login phase',
    };
  },
  token: async (body) => {
    const refreshToken = body.refreshToken;
    if (!refreshToken) {
      return {
        statusCode: 401,
        msg: 'UNAUTHORIZED',
      };
    }

    if (!listRefreshToken.includes(refreshToken)) {
      return {
        statusCode: 403,
        msg: 'FORBIDDEN',
      };
    }

    const result = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (result.err) {
      listRefreshToken = listRefreshToken.filter((item) => item !== refreshToken);
      return {
        statusCode: 403,
        msg: 'FORBIDDEN',
      };
    }

    const payload = {
      email: result.email,
      role: result.role,
    };
    const accessToken = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
    return {
      statusCode: 200,
      msg: 'OK',
      accessToken,
    };
  },
};
