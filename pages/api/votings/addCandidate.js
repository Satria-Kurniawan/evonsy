import mongoDbConnect from "../../../utils/mongoConnection"
import withAuth from "../../../middleware/withAuth"
import withRole from "../../../middleware/withRole"
import Voting from "../../../models/Voting"
import formidable from "formidable"
import fs from "fs"

export const config = {
  api: {
    bodyParser: false,
  },
}

async function addCandidate(req, res) {
  await mongoDbConnect()

  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" })

  const promise = new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      uploadDir: "./public/thumbnails",
    })

    form.parse(req, (err, fields, files) => {
      if (err) reject(err)

      resolve({ fields, files })

      fs.renameSync(
        files.thumbnail.filepath,
        `public/thumbnails/${files.thumbnail.originalFilename}`
      )
    })
  })

  promise.then(async ({ fields, files }) => {
    try {
      const candidateForVotings = await Voting.create({
        ketua: fields.ketua,
        wakil: fields.wakil,
        thumbnail: files?.thumbnail.originalFilename,
        visi: fields.visi,
        misi: fields.misi,
      })
      res.status(201).json({
        message: "Berhasil menambahkan data kandidat Ketua & Wakil Ketua Umum",
        candidateForVotings,
      })
      res.send({ fields, files })
    } catch (error) {
      res.status(400).json({ error })
    }
  })
}

export default withAuth(withRole(addCandidate, "admin"))
