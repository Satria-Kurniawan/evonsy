import mongoDbConnect from "../../../../utils/mongoConnection"
import withAuth from "../../../../middleware/withAuth"
import withRole from "../../../../middleware/withRole"
import Voting from "../../../../models/Voting"

async function deleteCandidate(req, res) {
  await mongoDbConnect()

  if (req.method !== "DELETE")
    return res.status(405).json({ message: "Method not allowed" })

  const { id } = req.query

  try {
    const candidate = await Voting.findById(id)

    if (!candidate) {
      res.json({ message: `Kandidat dengan id ${id} tidak ditemukan.` })
    }

    await candidate.remove()

    res.json({ message: "Delete success.", candidate })
  } catch (error) {
    res.status(400).json({ error })
  }
}

export default withAuth(withRole(deleteCandidate, "admin"))
