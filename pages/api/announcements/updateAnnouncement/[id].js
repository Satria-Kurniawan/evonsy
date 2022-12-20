import mongoDbConnect from "../../../../utils/mongoConnection"
import Announcement from "../../../../models/Announcement"
import withAuth from "../../../../middleware/withAuth"
import withRole from "../../../../middleware/withRole"
import formidable from "formidable"
import fs from "fs"

export const config = {
  api: {
    bodyParser: false,
  },
}

async function updateAnnouncement(req, res) {
  await mongoDbConnect()

  if (req.method !== "PUT")
    return res.status(405).json({ message: "Method not allowed" })

  const { id } = req.query

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
      const announcement = await Announcement.findById(id)

      const fileName =
        Object.keys(files).length === 0
          ? announcement.image
          : files?.image.originalFilename

      const updatedAnnouncement = await Announcement.findByIdAndUpdate(
        id,
        {
          title: fields.title,
          subtitle: fields.subtitle,
          content: fields.content,
          image: fileName,
        },
        { new: true }
      )

      res.status(200).json({
        message: "Berhasil memperbarui data pengumuman.",
        updatedAnnouncement,
      })
      res.send({ fields, files })
    } catch (error) {
      res.status(400).json({ error })
    }
  })
}

export default withAuth(withRole(updateAnnouncement, "admin"))
