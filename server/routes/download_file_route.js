import { Router } from "express";
import { generateSignedUrl } from "../cloudinary.js";

const download_file_router = Router();

download_file_router.get("/generate-signed-url/:publicId", (req, res) => {
  const { publicId } = req.params;
  try {
    const signedUrl = generateSignedUrl(publicId);
    res.status(200).json({ signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
});

export default download_file_router;
