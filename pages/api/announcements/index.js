import mongoDbConnect from "../../../utils/mongoConnection"
import Announcement from "../../../models/Announcement"

async function getAnnouncements(req, res) {
  await mongoDbConnect()

  try {
    const announcements = await Announcement.find()

    res.status(200).json({ announcements })
  } catch (error) {
    res.status(500).json({ error })
  }
}

export default getAnnouncements
