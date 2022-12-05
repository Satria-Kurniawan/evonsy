import mongoDbConnect from "../../../utils/mongoConnection"
import User from "../../../models/User"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  })
}

export default async function loginUser(req, res) {
  await mongoDbConnect()

  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" })

  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ message: "Please input all fields" })

  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(400).json({ message: "Invalid credentials!" })
  }
}
