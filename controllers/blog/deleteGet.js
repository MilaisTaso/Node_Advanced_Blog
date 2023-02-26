const BlogModel = require("../../models/blog");

// ブログの消去
module.exports =  async(req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);
  res.render('blogDelete', {singleBlog});
};
