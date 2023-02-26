const UserModel = require('../../models/user');

module.exports =  (req, res) => {
  UserModel.findOne({email: req.body.email}, (error, savedUserData) => {
    if (savedUserData) {
      if (req.body.password === savedUserData.password) {
        req.session.userId = savedUserData._id;
        res.redirect("/");
      } else {
        res.render("error", {message: "/user/loginのエラー:パスワードが違います"});
      }
    } else {
      res.render("error", {message: "/user/loginのエラー: ユーザーが存在しません"});
    }
  });
};
