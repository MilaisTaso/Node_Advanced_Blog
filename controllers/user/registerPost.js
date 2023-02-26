const UserModel = require('../../models/user');

//新規会員登録
module.exports =  (req, res) => {
  UserModel.create(req.body, (error, savedUserData) => {
    if (error) {
      res.render("error", { message: "/user/createのエラー"});
    } else {
      res.redirect("/user/login");
    }
  });
};
