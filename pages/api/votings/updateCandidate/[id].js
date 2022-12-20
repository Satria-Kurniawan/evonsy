import mongoDbConnect from "../../../../utils/mongoConnection"
import Voting from "../../../../models/Voting"
import withAuth from "../../../../middleware/withAuth"
import withRole from "../../../../middleware/withRole"
import formidable from "formidable"
import fs from "fs"

export const config = {
  api: {
    bodyParser: false,
  },
}

async function updateCandidate(req, res) {
  await mongoDbConnect()

  if (req.method !== "PUT")
    return res.status(405).json({ message: "Method not allowed" })

  const { id } = req.query

  const promise = new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      uploadDir: "./public/thumbnails",
      allowEmptyFiles: true,
    })

    form.parse(req, (err, fields, files) => {
      if (err) reject(err)

      resolve({ fields, files })

      if (files) {
        fs.renameSync(
          files.thumbnail.filepath,
          `public/thumbnails/${files.thumbnail.originalFilename}`
        )
      }
    })
  })

  promise.then(async ({ fields, files }) => {
    try {
      const candidate = await Voting.findById(id)

      const fileName =
        Object.keys(files).length === 0
          ? candidate.thumbnail
          : files?.thumbnail.originalFilename

      const candidateForVotings = await Voting.findByIdAndUpdate(
        id,
        {
          ketua: fields.ketua,
          wakil: fields.wakil,
          thumbnail: fileName,
          visi: fields.visi,
          misi: fields.misi,
        },
        { new: true }
      )

      res.status(200).json({
        message: "Berhasil memperbarui data kandidat Ketua & Wakil Ketua Umum",
        candidateForVotings,
      })
    } catch (error) {
      res.status(400).json({ error })
    }
  })
}

export default withAuth(withRole(updateCandidate, "admin"))
