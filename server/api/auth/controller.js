const authService = require('./service');

module.exports = {
  signup: async (req, res, next) => {
    let DTO = await authService.signup(req.body);
    let stt = 200;
    if (DTO.error) stt = 500;
    res.status(stt).json(DTO.msg);
  },
  login: async (req, res, next) => { 
    let DTO = await authService.login(req.body);
    let stt = 200;
    if (DTO.error) stt = 500;
    res.status(stt).json({
      token: DTO.token,
      msg: DTO.msg,
    });
  },
};