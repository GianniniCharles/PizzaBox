// YOU MUST NPM INSTALL THE CLOUDINARY PACKAGES

const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  // YOU HAVE TO HAVE THESE VARIABLE KEYS
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

var storage = cloudinaryStorage({
  // Key HAS to be cloudinary. value HAS to be the cloudinary var declared above
  cloudinary: cloudinary,
  folder: 'folder-name', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png', 'jpeg'],
  filename: function (req, file, cb) {
    cb(null, 'my-file-name'); // The file on cloudinary would have the same name as the original file name
    //change the value after null to a string
  }
});

// STORAGE value must === the storage variable above
const uploadCloud = multer({ storage: storage });

module.exports = uploadCloud;