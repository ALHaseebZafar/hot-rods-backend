const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  availability: { type: Boolean, default: true }, // Checkbox for availability
  notAvailable: [
      {
          from: { type: Date, required: true },
          to: { type: Date, required: true },
      },
  ],
  image: { type: String, trim: true },
});

const Professional = mongoose.model('Professional', professionalSchema);

module.exports = Professional;
