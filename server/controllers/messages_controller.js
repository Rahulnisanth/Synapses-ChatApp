import { Message } from "../models/message_model.js";
import { uploadToSupabase } from "../supabase-storage.js";

// Search contacts controller:
export const getMessages = async (request, response, next) => {
  try {
    const user1 = request.user_id;
    const user2 = request.body.id;
    if (!user1 || !user2) {
      return response.status(400).send("Both users are required.");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });
    return response.status(200).json({ messages });
  } catch (err) {
    console.error("Error occurred in getting messages", err);
    return response.status(500).send("Internal server error!");
  }
};

// Updated addFiles Controller with additional debugging
export const addFiles = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).json({ message: "File is required" });
    }

    const result = await uploadToSupabase(request.file, "files");
    return response.status(200).json({
      filePath: result.publicUrl,
      message: "File uploaded successfully",
    });
  } catch (err) {
    console.error("Error occurred in adding files:", err);
    return response.status(500).send("Internal server error!");
  }
};

// Get the signed url for downloading the hard files
export const getSignedUrl = async (request, response, next) => {
  try {
    const { fileUrl } = request.params;
    const filePath = decodeURIComponent(fileUrl);

    console.log("File Path => ", filePath);

    const { signedURL, error } = await supabase.storage
      .from("all-files")
      .createSignedUrl(filePath, 60 * 60);

    if (error) {
      return response
        .status(500)
        .json({ error: "Failed to generate signed URL" });
    }

    console.log("Generated Signed URL => ", signedURL);
    return response.json({ signedUrl: signedURL });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    return response.status(500).json({ error: "Internal server error" });
  }
};
