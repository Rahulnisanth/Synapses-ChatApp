import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  first_name: {
    type: String,
    required: false,
  },
  last_name: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  profile_setup: {
    type: Boolean,
    required: false,
  },
});

user_schema.pre("save", async function (next_func) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  // Getting the function as the parameter and invoking the save schema after the password is hashed...
  next_func();
});

const User = mongoose.model("users", user_schema);
export default User;
