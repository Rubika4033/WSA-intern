import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "This is required"],
  },
  email: {
    type: String,
    required: [true, "This is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "This is required"],
    minlength: 6,
  },
  avatar: {
    type: String,
    default: "",
  },
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date,
  favourites: [
    {
      id: { type: String, required: true },
      name: String,
      artist_name: String,
      image: String,
      duration: String,
      audio: String,
    },
  ],
});

// ✅ pre-save hook (Mongoose 7+)
userschema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// compare password
userschema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userschema);
export default User;
