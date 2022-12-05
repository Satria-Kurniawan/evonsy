import mongoDbConnect from "../../../utils/mongoConnection"
import User from "../../../models/User"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

export default async function registerUser(req, res) {
  await mongoDbConnect()

  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" })

  const { email, name, password } = req.body

  if (!name || !email || !password)
    return res.status(400).json({ message: "Please input all fields" })

  const userExists = await User.findOne({ email })

  if (userExists)
    return res.status(400).json({ message: "User already exists" })

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } else {
    return res.status(400).json({ message: "Invalid user data!" })
  }
}
