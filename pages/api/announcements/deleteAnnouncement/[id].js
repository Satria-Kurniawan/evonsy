import mongoDbConnect from "../../../../utils/mongoConnection"
import Announcement from "../../../../models/Announcement"
import withAuth from "../../../../middleware/withAuth"
import withRole from "../../../../middleware/withRole"
import mongoose from "mongoose"

async function deleteAnnouncement(req, res) {
  await mongoDbConnect()

  if (req.method !== "DELETE")
    return res.status(405).json({ message: "Method not allowed" })

  const { id } = req.query

  try {
    const announcement = await Announcement.findById(id)

    if (!announcement) {
      res.json({ message: `Pengumuman dengan id ${id} tidak ditemukan.` })
    }

    await announcement.remove()

    res.json({ message: "Berhasil menghapus pengumuman.", announcement })
  } catch (error) {
    res.status(500).json(error)
  }
}

export default withAuth(withRole(deleteAnnouncement, "admin"))
