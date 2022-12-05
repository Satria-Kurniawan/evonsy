import mongoose from "mongoose"

const votingSchema = mongoose.Schema({
  ketua: {
    type: String,
    required: true,
  },
  wakil: {
    type: String,
    required: true,
  },
  visi: {
    type: String,
    required: true,
  },
  misi: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  currentVotes: {
    type: Number,
    default: 0,
  },
})

const Voting = mongoose.models.Voting || mongoose.model("Voting", votingSchema)

export default Voting
