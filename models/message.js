const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  chat: { type: Schema.Types.ObjectId, res: 'Chat', required: true },
  timestamp: { type: Date, required: true },
  content: { type: String, required: true, maxLength: 2000 },
  seen: { type: Array[Schema.Types.ObjectId], ref: 'User' },
});

// Virtuals 
MessageSchema.virtual('formatted_timestamp').get(function () {
  return DateTime.fromJSDate(this.timestamp).toISODate();
});

module.exports = mongoose.model('Message', MessageSchema);