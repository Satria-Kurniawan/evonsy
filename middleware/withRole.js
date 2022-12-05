export default function withRole(handler, ...roles) {
  return async function (req, res) {
    if (!roles.includes(req.user.role))
      return res.status(400).json({ message: "Unauthorized, admin only." })

    return handler(req, res)
  }
}
