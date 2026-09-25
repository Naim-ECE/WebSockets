import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  profilePicture: {
    type: String,
    default: function () {
      return this.gender === "Male"
        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt2KTkSSFRWMfy3Hr_XjbHbs2dnoXoeu_Cb242tzcMug&s"
        : "https://png.pngtree.com/png-vector/20241124/ourlarge/pngtree-detailed-anime-portrait-of-a-female-character-png-image_14191504.png";
    },
  },
});

const User = mongoose.model("User", userSchema);
export default User;
