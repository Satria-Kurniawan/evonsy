import withAuth from "../../../middleware/withAuth"

function loggedUser(req, res) {
  res.json(req.user)
}

export default withAuth(loggedUser)
