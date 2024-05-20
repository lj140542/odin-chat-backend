const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  name: { type: String, required: true },
  users: { type: Array[Schema.Types.ObjectId], ref: 'User' },
});

module.exports = mongoose.model('Chat', ChatSchema);