const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  availability: {
    type: Boolean,
    required:true,
  },
  image: {
    type: String, // This will store the path of the uploaded image
  },
});

const Professional = mongoose.model("Professional", professionalSchema);
module.exports = Professional;
