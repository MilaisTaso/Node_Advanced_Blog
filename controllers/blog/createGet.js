const BlogModel = require("../../models/blog");

// 投稿フォーム
module.exports = (req, res) => {
  if(req.session.userId) {
    res.render('blogCreate');
  } else {
    res.redirect('/user/login');
  }
};
