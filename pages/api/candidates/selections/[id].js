import mongoDbConnect from "../../../../utils/mongoConnection"
import Candidate from "../../../../models/Candidate"
import withAuth from "../../../../middleware/withAuth"
import withRole from "../../../../middleware/withRole"

async function candidatesSelection(req, res) {
  await mongoDbConnect()

  if (req.method !== "PUT")
    return res.status(405).json({ message: "Method not allowed" })

  const { statusPendaftaran } = req.body

  console.log(req.body)

  if (!statusPendaftaran)
    return res.status(400).json({ message: "Status pendaftaran wajib diisi." })

  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.query.id,
      { statusPendaftaran },
      { new: true }
    )

    res.json({ candidate })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

export default withAuth(withRole(candidatesSelection, "admin"))
