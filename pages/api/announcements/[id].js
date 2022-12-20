import mongoDbConnect from "../../../utils/mongoConnection"
import Announcement from "../../../models/Announcement"

async function getAnnouncement(req, res) {
  await mongoDbConnect()

  const { id } = req.query

  try {
    const announcement = await Announcement.findById(id)

    res.status(200).json({ announcement })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default getAnnouncement
