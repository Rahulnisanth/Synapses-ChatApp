import { User } from "../models/user_model.js";
import jwt from "jsonwebtoken";

const max_timer = 3 * 24 * 1440 * 86400; // 3 days

const createToken = (email, user_id) => {
  return jwt.sign({ email, user_id }, process.env.JWT_KEY, {
    expiresIn: max_timer,
  });
};

export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password)
      return response.status(500).send("Email and password is required.");
    // creating new user if email & password is found...
    const user = new User.create({ email, password });
    // Storing the sign up details in site cookies...
    response.cookie("jwt", createToken(email, user.id), {
      max_timer,
      secure: true,
      sameSite: "None",
    });
    return response.status(201).json({
      user: {
        id: user.user_id,
        email: user.email,
        profile_setup: user.profile_setup,
      },
    });
  } catch (err) {
    return response.status(500).send("Internal server error!");
  }
};
