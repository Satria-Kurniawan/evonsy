import mongoDbConnect from "../../../utils/mongoConnection"
import Announcement from "../../../models/Announcement"
import withAuth from "../../../middleware/withAuth"
import withRole from "../../../middleware/withRole"
import formidable from "formidable"
import fs from "fs"

export const config = {
  api: {
    bodyParser: false,
  },
}

async function createAnnouncement(req, res) {
  await mongoDbConnect()

  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" })

  const promise = new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      uploadDir: "./public/uploads",
    })

    form.parse(req, (err, fields, files) => {
      if (err) reject(err)

      resolve({ fields, files })

      fs.renameSync(
        files.image.filepath,
        `./public/uploads/${files.image.originalFilename}`
      )
    })
  })

  promise.then(async ({ fields, files }) => {
    try {
      const announcement = await Announcement.create({
        title: fields.title,
        subtitle: fields.subtitle,
        content: fields.content,
        image: files?.image.originalFilename,
      })
      res.status(201).json({
        message: "Berhasil menambahkan data pengumuman.",
        announcement,
      })
      res.send({ fields, files })
    } catch (error) {
      res.status(400).json({ error })
    }
  })
}

export default withAuth(withRole(createAnnouncement, "admin"))
