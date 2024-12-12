const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  availability: {
    type: String,
    default: 'yes',
    enum: ['yes', 'no']
  },
  image: {
    type: String,
    trim: true,
    required:false
  }
});

const Professional = mongoose.model('Professional', professionalSchema);

module.exports = Professional;