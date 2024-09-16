const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: String,
  date: Date,
  userId: mongoose.Schema.Types.ObjectId // Reference to User
});

module.exports = mongoose.model('Task', taskSchema);
