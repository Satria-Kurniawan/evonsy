import mongoose from "mongoose"

const candidateSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    divisi: {
      type: String,
      required: true,
    },
    jabatan: {
      type: String,
      required: true,
    },
    berkas: {
      type: String,
      required: true,
    },
    statusPendaftaran: {
      type: String,
      default: "Seleksi Administrasi",
    },
  },
  {
    timestamps: true,
  }
)

const Candidate =
  mongoose.models.Candidate || mongoose.model("Candidate", candidateSchema)

export default Candidate
