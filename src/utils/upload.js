const multer = require("multer");
const path = require("path");

const upload = multer({
  dest: path.join(__dirname, "../uploads/"), // Destination folder for uploaded files
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter(req, file, cb) {
    // Allow only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image (jpg, jpeg, or png)."));
    }
    cb(null, true);
  },
});

module.exports = upload;
