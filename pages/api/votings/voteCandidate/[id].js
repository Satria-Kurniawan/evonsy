import mongoDbConnect from "../../../../utils/mongoConnection"
import Voting from "../../../../models/Voting"
import withAuth from "../../../../middleware/withAuth"

async function voteCandidate(req, res) {
  await mongoDbConnect()

  if (req.method !== "PUT")
    return res.status(405).json({ message: "Method not allowed" })

  const { id } = req.query

  try {
    const candidates = await Voting.find()

    const hasVoted = candidates.some(({ voter }) =>
      voter.some(
        (userId) => JSON.stringify(userId) === JSON.stringify(req.user._id)
      )
    )

    if (hasVoted)
      return res.status(200).json({
        hasVoted: true,
        message:
          "Kesempatan voting anda telah habis, Anda telah melakukan voting.",
      })

    const candidate = await Voting.findById(id)

    const votedCandidate = await Voting.findByIdAndUpdate(
      id,
      {
        currentVotes: (candidate.currentVotes += 1),
        $push: { voter: req.user._id },
      },
      { new: true }
    )

    res
      .status(200)
      .json({ message: "Berhasil melakukan voting.", votedCandidate })
  } catch (error) {
    res.status(400).json({ error })
  }
}

export default withAuth(voteCandidate)
