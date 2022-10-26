const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {
    type: Object,
    required: true
  },
  post: {
    type: Object,
    required: true
  }
})

module.exports = mongoose.model('Post', postSchema);