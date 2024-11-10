import multer from "multer";

const storage = multer.memoryStorage();

// Fixed regular expression for file type validation
const fileFilter = (req, file, cb) => {
  // Properly formatted regex for image file types
  if (
    !file.originalname.match(
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i
    )
  ) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

export default upload;
