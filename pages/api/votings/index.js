import mongoDbConnect from "../../../utils/mongoConnection"
import Voting from "../../../models/Voting"

async function getCandidatesForVotings(req, res) {
  await mongoDbConnect()

  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" })

  try {
    const candidatesForVotings = await Voting.find()

    res.json({ candidatesForVotings })
  } catch (error) {
    console.log(error)
  }
}

export default getCandidatesForVotings
