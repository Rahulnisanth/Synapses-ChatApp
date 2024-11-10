import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  first_name: {
    type: String,
    required: false,
    default: "",
  },
  last_name: {
    type: String,
    required: false,
    default: "",
  },
  image: {
    type: String,
    default: null,
  },
  public_id: {
    type: String,
    default: null,
  },
  profile_setup: {
    type: Boolean,
    required: false,
    default: false,
  },
});

// Pre-save hook to hash password
user_schema.pre("save", async function (next_func) {
  if (this.isModified("password")) {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
  }
  next_func();
});

// Create and export the User model
export const User = mongoose.model("Users", user_schema);
