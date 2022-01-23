const db = require('../../models/db');

module.exports = {
  update: async (req) => {
    try {
      const user = await db.get('users').find({ email: req.user.email });

      if (!user.value()) {
        return {
          statusCode: 500,
          msg: 'Error in update',
        };
      }

      const normalProperties = ['name', 'address', 'phone', 'avatar'];
      for (let i = 0; i < normalProperties.length; ++i) {
        const p = normalProperties[i];
        if (req.body[p]) {
          user.assign({ [p]: req.body[p] }).write();
        }
      }

      return {
        statusCode: 200,
        msg: 'OK',
      };
    } catch {
      return {
        statusCode: 500,
        msg: 'Error in update',
      };
    }
  },
};