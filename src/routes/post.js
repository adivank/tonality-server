const Post = require('../schemas/post-shema');

exports.getPostArray = async (req, res) => {
  await Post.find({}).then(postList => {
    res.send(postList);
  })
}