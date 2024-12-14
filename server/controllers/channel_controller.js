import { Channel } from "../models/channel_model.js";
import { User } from "../models/user_model.js";

// Create channels controller
export const createChannel = async (request, response, next) => {
  try {
    const { name, members } = request.body;
    const admin = await User.findById(request.user_id);
    if (!admin) {
      return response.status(400).message("Admin user not found.");
    }
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return response.status(400).message("Some of members are not found.");
    }
    const newChannel = new Channel({
      name,
      members,
      admin: request.user_id,
    });
    await newChannel.save();
    return response.status(200).json({ channel: newChannel });
  } catch (err) {
    console.error("Error occurred during creating channel", err);
    return response.status(500).send("Internal server error!");
  }
};

// Get user channels controller
export const getUserChannels = async (request, response, next) => {
  try {
    const channels = await Channel.find({
      $or: [{ admin: request.user_id }, { members: request.user_id }],
    }).sort({ updatedAt: -1 });
    if (!channels) {
      return response.status(400).message("No channels found.");
    }
    return response.status(200).json({ channels });
  } catch (err) {
    console.error("Error occurred in getting user channels", err);
    return response.status(500).send("Internal server error!");
  }
};

// Get all messages from single channel controller
export const getChannelMessages = async (request, response, next) => {
  try {
    const { channelId } = request.params;
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "_id email first_name last_name image",
      },
    });
    if (!channel) return response.status(400).send("Channel not found");
    const messages = channel.messages;
    return response.status(200).json({ messages });
  } catch (e) {
    console.log("Error occurred in getting channel messages", e);
    return response.status(500).send("Internal server error");
  }
};
