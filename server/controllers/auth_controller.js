import { compare } from "bcrypt";
import { User } from "../models/user_model.js";
import jwt from "jsonwebtoken";
import { uploadToSupabase, deleteFromSupabase } from "../supabase-storage.js";

const max_timer = 3 * 24 * 1000 * 1000;

const createToken = (email, user_id) => {
  return jwt.sign({ email, user_id }, process.env.JWT_KEY, {
    expiresIn: max_timer,
  });
};

// Sign up controller:
export const signup = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password)
      return response.status(400).send("Email and password are required.");

    const user = await User.create({ email, password });

    response.cookie("jwt", createToken(email, user._id), {
      maxAge: max_timer * 1000,
      sameSite: "Lax",
      secure: false,
    });

    return response.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        profile_setup: user.profile_setup,
      },
    });
  } catch (err) {
    console.error("Error occurred during signup", err);
    return response.status(500).send("Internal server error!");
  }
};

// Login controller:
export const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password)
      return response.status(400).send("Email and password are required.");

    const user = await User.findOne({ email });
    if (!user) return response.status(404).send("User not found.");

    const auth = await compare(password, user.password);
    if (!auth) return response.status(401).send("Incorrect password.");

    response.cookie("jwt", createToken(email, user._id), {
      maxAge: max_timer * 1000,
      sameSite: "Lax",
      secure: false,
    });

    return response.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        image: user.image,
        profile_setup: user.profile_setup,
      },
    });
  } catch (err) {
    console.error("Error occurred during login", err);
    return response.status(500).send("Internal server error!");
  }
};

// Get User Info:
export const getUserInfo = async (request, response) => {
  try {
    const user_id = request.user_id;
    const userData = await User.findById(user_id);

    if (!userData) return response.status(404).send("User not found.");

    return response.status(200).json({
      id: userData._id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      image: userData.image,
      profile_setup: userData.profile_setup,
    });
  } catch (err) {
    console.error("Error occurred during getUserInfo", err);
    return response.status(500).send("Internal server error!");
  }
};

// Update User Info :
export const updateUserInfo = async (request, response) => {
  try {
    const user_id = request.user_id;
    const { first_name, last_name } = request.body;

    if (!user_id) {
      return response.status(400).send("User ID is required.");
    }
    if (!first_name || !last_name) {
      return response.status(400).send("FirstName and LastName are required.");
    }

    const userData = await User.findByIdAndUpdate(
      user_id,
      {
        first_name,
        last_name,
        profile_setup: true,
      },
      { new: true, runValidators: true }
    );
    if (!userData) {
      return response.status(404).send("User not found.");
    }

    return response.status(200).json({
      id: userData._id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      image: userData.image,
      profile_setup: userData.profile_setup,
    });
  } catch (err) {
    console.error("Error occurred during updateUserInfo function", err);
    return response.status(500).send("Internal server error!");
  }
};

// Add profile image controller
export const addProfileImage = async (request, response) => {
  try {
    const user_id = request.user_id;

    if (!request.file) {
      return response.status(400).json({ message: "File is required" });
    }

    const result = await uploadToSupabase(request.file, "profiles");

    const currentUser = await User.findById(user_id);
    if (currentUser?.image && currentUser.public_id) {
      await deleteFromSupabase(currentUser.public_id).catch((err) => {
        console.warn("Old image deletion failed:", err);
      });
    }

    currentUser.image = result.publicUrl;
    currentUser.public_id = result.filePath;
    await currentUser.save();

    return response.status(200).json({
      image: currentUser.image,
      message: "Profile image updated successfully",
    });
  } catch (err) {
    console.error("Error occurred during addProfileImage", err);
    return response.status(500).send("Internal server error!");
  }
};

// Delete profile image controller
export const deleteProfileImage = async (request, response) => {
  try {
    const user_id = request.user_id;
    const user = await User.findById(user_id);

    if (!user) {
      return response.status(404).send("User not found");
    }

    if (user.public_id) {
      await deleteFromSupabase(user.public_id).catch((err) => {
        console.warn("Image deletion failed:", err);
      });
    }

    user.image = null;
    user.public_id = null;
    await user.save();

    return response.status(200).json({
      message: "Profile image deleted successfully.",
    });
  } catch (err) {
    console.error("Error occurred during deleteProfileImage", err);
    return response.status(500).send("Internal server error!");
  }
};

// Logout controller:
export const logout = async (request, response) => {
  try {
    response.cookie("jwt", "", {
      maxAge: 1,
      sameSite: "Lax",
      secure: false,
    });
    return response.status(200).send("User logged out successfully.");
  } catch (err) {
    console.error("Error occurred during logout", err);
    return response.status(500).send("Internal server error!");
  }
};
