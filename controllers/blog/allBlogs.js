const BlogModel = require("../../models/blog")

// ブログ一覧画面
module.exports =  async(req, res) => {
  const allBlogs = await BlogModel.find();
  res.render('index', {allBlogs: allBlogs, session: req.session.userId});
};
