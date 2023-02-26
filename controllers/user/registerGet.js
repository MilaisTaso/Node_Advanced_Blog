const UserModel = require('../../models/user');

// 会員登録
module.exports =  (req, res) => {
  res.render("userCreate");
};
