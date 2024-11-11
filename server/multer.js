import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

export default upload;
