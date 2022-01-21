const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../models/db');

const secret = process.env.SECRET_KEY;
// console.log(secret);

module.exports = {
  signup: async (body) => {
    if (!body.name || !body.email || !body.name) {
      return {
        error: true,
        msg: 'Invalid request',
      };
    }

    let users = await db.get('users').value();
    let filterUser = await users.filter((user) => user.email === body.email);

    if (filterUser.length > 0) {
      return {
        error: true,
        msg: 'Email is already existed',
      };
    }

    let salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(body.password, salt);
    let objectUser = {
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
    let users = await db.get('users').value();
    let filterUser = await users.filter((user) => user.email === body.email);
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
        let signOptions = {
          expiresIn: '12h',
        };
        const token = await jwt.sign(payload, secret, signOptions);

        return {
          token,
          error: false,
          msg: 'Welcome back',
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
};