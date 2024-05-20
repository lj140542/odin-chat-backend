const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String, required: true, maxLength: 25 },
  lastname: { type: String, required: true, maxLength: 25 },
  username: { type: String, required: true, maxLength: 25 },
  password: { type: String, required: true, maxLength: 30 },
});

// Virtuals 
UserSchema.virtual('fullname').get(function () {
  if (this.firstname && this.lastname) return `${this.firstname} ${this.lastname}`;
  else if (this.firstname) return this.firstname;
  else if (this.lastname) return this.lastname;
  else return '';
});

module.exports = mongoose.model('User', UserSchema);