const mongoose = require("mongoose");

const ContactUsSchema = new mongoose.Schema({
fullname:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
question:{
    type:String,
}
});

const ContactUs = mongoose.model("ContacUs", ContactUsSchema);
module.exports = ContactUs;
