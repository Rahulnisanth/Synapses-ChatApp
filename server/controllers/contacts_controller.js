import { Message } from "../models/message_model.js";
import { User } from "../models/user_model.js";
import Mongoose from "mongoose";

// Function to escape special regex characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Search contacts controller:
export const searchContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;
    if (searchTerm === undefined || searchTerm === null || searchTerm === "") {
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

// DM List controller:
export const getDMList = async (request, response, next) => {
  try {
    let { user_id } = request;
    user_id = new Mongoose.Types.ObjectId(user_id);
    if (!user_id) return response.status(400).send("User ID is required.");
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: user_id }, { recipient: user_id }],
        },
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", user_id] }, "$recipient", "$sender"],
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      { $unwind: "$contactInfo" },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          first_name: "$contactInfo.first_name",
          last_name: "$contactInfo.last_name",
          image: "$contactInfo.image",
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);
    return response.status(200).json({ contacts });
  } catch (err) {
    console.error("Error occurred in getting DM list", err);
    return response.status(500).send("Internal server error!");
  }
};

// All contacts controller :
export const getAllContacts = async (request, response, next) => {
  try {
    const users = await User.find(
      { _id: { $ne: request.user_id } },
      "_id first_name last_name email"
    );
    const contacts = users.map((user) => ({
      label:
        user.first_name && user.last_name
          ? `${user.first_name} ${user.last_name}`
          : user.email,
      value: user._id,
    }));
    return response.status(200).json({ contacts });
  } catch (err) {
    console.error("Error occurred in getting all contacts", err);
    return response.status(500).send("Internal server error!");
  }
};
