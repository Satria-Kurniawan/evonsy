import mongoDbConnect from "../../../utils/mongoConnection"
import Candidate from "../../../models/Candidate"
import withAuth from "../../../middleware/withAuth"
import formidable from "formidable"
import fs from "fs"

export const config = {
  api: {
    bodyParser: false,
  },
}

async function registerCandidate(req, res) {
  await mongoDbConnect()

  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" })

  const promise = new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({ uploadDir: "./public/uploads" })

    form.parse(req, (err, fields, files) => {
      if (err) reject(err)

      resolve({ fields, files })

      fs.renameSync(
        files.berkas.filepath,
        `public/uploads/${files.berkas.originalFilename}`
      )
    })
  })

  promise.then(async ({ fields, files }) => {
    try {
      const candidate = await Candidate.create({
        user: req.user?._id,
        divisi: fields.divisi,
        jabatan: fields.jabatan,
        berkas: files.berkas?.originalFilename,
      })

      res.status(201).json({
        message:
          "Pendaftaran berhasil dilakukan, mohon menunggu informasi berikutnya.",
        candidate,
      })
    } catch (error) {
      return res.status(400).json({ error })
    }
  })
}

export default withAuth(registerCandidate)
