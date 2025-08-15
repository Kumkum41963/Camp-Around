const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv')
dotenv.config()

// Associating Account
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET
})

// Instantitating the storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "Camp-Around",
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})

module.exports = {
    cloudinary,
    storage
}