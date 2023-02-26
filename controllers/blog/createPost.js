const BlogModel = require("../../models/blog");

// ブログ投稿アクション
module.exports =  (req, res) => {
  BlogModel.create(req.body, (error, savedBlogData) => {
    if (error) {
      res.render('error', {message: "/blog/createのエラー"});
    } else {
      res.redirect('/');
    }
  });
};
