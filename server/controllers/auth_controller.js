import { compare } from "bcrypt";
import { User } from "../models/user_model.js";
import jwt from "jsonwebtoken";

const max_timer = 3 * 24 * 60 * 60; // 3 days

const createToken = (email, user_id) => {
  return jwt.sign({ email, user_id }, process.env.JWT_KEY, {
    expiresIn: max_timer,
  });
};

// Sign up controller :
export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password)
      return response.status(500).send("Email and password is required.");
    // creating new user if email & password is found...
    const user = await User.create({ email, password });
    // Storing the sign up details in site cookies...
    response.cookie("jwt", createToken(email, user._id), {
      maxAge: max_timer * 1000,
      secure: process.env.NODE_ENV === "production",
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
    console.log("Error occurred in auth_controller", err);
    return response.status(500).send("Internal server error!");
  }
};

// Login controller :
export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password)
      return response.status(500).send("Email and password is required.");
    // checking the existed users email & password is found...
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(500).send("Email not matched.");
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(500).send("Password not matched.");
    }

    // Storing the sign up details in site cookies...
    response.cookie("jwt", createToken(email, user._id), {
      maxAge: max_timer * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return response.status(201).json({
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
    console.log("Error occurred in auth_controller", err);
    return response.status(500).send("Internal server error!");
  }
};
