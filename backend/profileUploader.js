const multer = require("multer")

const uploadBoth = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // مقصد را براساس نام فیلد تعیین می‌کنیم
      if (file.fieldname === 'profile') {
        cb(null, "./uploads/profiles")
      } else if (file.fieldname === 'header') {
        cb(null, "./uploads/headers")
      }
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname)
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jfif") {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  }
})


module.exports = uploadBoth