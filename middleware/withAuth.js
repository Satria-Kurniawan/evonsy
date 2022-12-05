import jwt from "jsonwebtoken"
import User from "../models/User"

export default function withAuth(handler) {
  return async function (req, res) {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(" ")[1]
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // Get user from token
        req.user = await User.findById(decoded.id).select("-password")

        return handler(req, res)
      } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
      }
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, no token." })
    }
  }
}
