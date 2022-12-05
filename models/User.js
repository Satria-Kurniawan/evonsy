import mongoose from "mongoose"

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    phone: {
      type: String,
      default: null,
    },
    jurusan: {
      type: String,
      default: null,
    },
    prodi: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User
