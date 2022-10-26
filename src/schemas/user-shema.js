const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = {
  information: {
    name: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    age: {
      type: String,
      default: null
    },
    gender: {
      type: String,
      default: null
    },
    address: {
      city: {
        type: String,
        default: null
      },
      strees: {
        type: String,
        default: null
      },
      streetNo: {
        type: String,
        default: null
      },
      postal: {
        type: String,
        default: null
      }
    },
  },
  userId: {
    type: String,
    required: true
  },
  login: {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  }
}

module.exports = mongoose.model('User', new Schema(userSchema));