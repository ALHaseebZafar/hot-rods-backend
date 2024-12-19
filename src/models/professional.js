const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  availability: [
    {
      date: { type: Date, required: true },
      day: { type: String,},
    },
  ],
  notAvailable: {
    type: Boolean, // Checkbox for availability
    default: false,
  },
  image: { type: String, trim: true, required: false },
});
const Professional = mongoose.model('Professional', professionalSchema);

module.exports = Professional;
