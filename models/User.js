const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  cognitoUserId: { type: String, required: true },
  isConfirmed: { type: Boolean, default: false },
  Plan: { type: String, default: null }  // Default to null

});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
