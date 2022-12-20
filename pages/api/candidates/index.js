import mongoDbConnect from "../../../utils/mongoConnection"
import Candidate from "../../../models/Candidate"

async function getCandidates(req, res) {
  await mongoDbConnect()

  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" })

  try {
    const candidates = await Candidate.find().populate("user")

    res.json({ candidates })
  } catch (error) {
    res.status(400).json({ error })
  }
}

export default getCandidates
