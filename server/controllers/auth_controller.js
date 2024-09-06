import { compare } from "bcrypt";
import { User } from "../models/user_model.js";
import jwt from "jsonwebtoken";

const max_timer = 3 * 24 * 60 * 60;

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
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "None",
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
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "None",
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
    const user_id = request._id;
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
