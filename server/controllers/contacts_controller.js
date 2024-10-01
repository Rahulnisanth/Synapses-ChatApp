import { User } from "../models/user_model.js";

// Function to escape special regex characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Search contacts controller:
export const searchContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;
    if (!searchTerm) {
      return response.status(400).send("Search term is required.");
    }
    const sanitizedTerm = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
    const escapedTerm = escapeRegex(sanitizedTerm);
    const regex = new RegExp(escapedTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.user_id } },
        {
          $or: [{ first_name: regex }, { last_name: regex }, { email: regex }],
        },
      ],
    });
    return response.status(200).json({ contacts });
  } catch (err) {
    console.error("Error occurred during contact search", err);
    return response.status(500).send("Internal server error!");
  }
};
