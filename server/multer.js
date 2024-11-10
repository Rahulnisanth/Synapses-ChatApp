import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      !file.originalname.match(
        /\.jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/
      )
    ) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

export default upload;
