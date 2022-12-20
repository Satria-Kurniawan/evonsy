import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
  MdDownload,
  MdSearch,
  MdFilterList,
  MdAdd,
  MdOutlineFileUpload,
  MdEditNote,
  MdDeleteSweep,
} from "react-icons/md"
import { HiOutlineArrowNarrowLeft, HiOutlineDotsVertical } from "react-icons/hi"
import Link from "next/link"
import Modal from "../../components/Modal"
import FormInput from "../../components/FormInput"
import Button from "../../components/Button"
import Image from "next/image"

export default function CandidatePage() {
  const { data: session } = useSession()
  const [candidates, setCandidates] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [candidatesForVotings, setCandidatesForVotings] = useState([])
  const [isUpdate, setIsUpdate] = useState(false)

  useEffect(() => {
    const getCandidates = async () => {
      if (session) {
        try {
          const response = await fetch("/api/candidates", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })

          const data = await response.json()

          const passedCandidates = data.candidates.filter(
            (obj) =>
              obj.statusPendaftaran === "Terpilih" ||
              obj.statusPendaftaran === "Lulus Seleksi I"
          )

          setCandidates(passedCandidates)
        } catch (error) {
          console.log(error)
        }
      }
    }

    getCandidates()
  }, [session])

  const inputs = [
    {
      label: "Nama Ketua",
      type: "text",
      name: "ketua",
      placeholder: "Masukan nama Ketua.",
      errorMessage: "Nama Ketua wajib diisi!",
      required: true,
    },
    {
      label: "Nama Wakil Ketua",
      type: "text",
      name: "wakil",
      placeholder: "Masukan nama Wakil Ketua.",
      errorMessage: "Nama Wakil wajib diisi!",
      required: true,
    },
  ]

  const [values, setValues] = useState({
    ketua: "",
    wakil: "",
    visi: "",
    misi: "",
  })

  const { ketua, wakil, visi, misi } = values

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("No File Choosen")

  const onFileChange = (e) => {
    if (!e.target.files.length) return

    setFile(e.target.files[0])
    setFileName(e.target.files[0].name)
  }

  const [currentStep, setCurrentStep] = useState(0)

  const onNextStep = () => {
    setCurrentStep((i) => {
      if (currentStep === 1) return currentStep
      return i + 1
    })
  }

  const onBackStep = () => {
    setCurrentStep((i) => {
      if (currentStep === 0) return currentStep
      return i - 1
    })
  }

  const prepAddCandidate = () => {
    setIsOpen(true)
    setIsUpdate(false)
    setValues((prev) => (prev = { ...prev, ketua: "" }))
    setValues((prev) => (prev = { ...prev, wakil: "" }))
    setValues((prev) => (prev = { ...prev, visi: "" }))
    setValues((prev) => (prev = { ...prev, misi: "" }))
    setFile(null)
    setFileName("")
  }

  const onAddCandidate = async (e) => {
    e.preventDefault()

    if (currentStep !== 1) return onNextStep()

    const fd = new FormData()

    fd.append("ketua", ketua)
    fd.append("wakil", wakil)
    fd.append("visi", visi)
    fd.append("misi", misi)
    fd.append("thumbnail", file)

    if (session) {
      try {
        const response = await fetch("/api/votings/addCandidate", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: fd,
        })

        const data = await response.json()

        setCandidatesForVotings([
          ...candidatesForVotings,
          data.candidateForVotings,
        ])

        if (response.ok) {
          setValues((prev) => (prev = { ...prev, ketua: "" }))
          setValues((prev) => (prev = { ...prev, wakil: "" }))
          setValues((prev) => (prev = { ...prev, visi: "" }))
          setValues((prev) => (prev = { ...prev, misi: "" }))
          setFile(null)
          setFileName("")
          setCurrentStep(0)
          setIsOpen(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    const getCandidatesForVotings = async () => {
      if (session) {
        try {
          const response = await fetch("/api/votings", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })

          const data = await response.json()

          setCandidatesForVotings(data.candidatesForVotings)
        } catch (error) {
          console.log(error)
        }
      }
    }

    getCandidatesForVotings()
  }, [session?.accessToken])

  const onDeleteCandidate = async (id) => {
    try {
      const response = await fetch(`/api/votings/deleteCandidate/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })

      setCandidatesForVotings((prev) => prev.filter(({ _id }) => _id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  const [selectedCandidateId, setSelectedCandidateId] = useState("")

  const prepCandidateBeforeUpdate = (candidate) => {
    setIsUpdate(true)
    setIsOpen(true)
    setSelectedCandidateId(candidate._id)
    setValues((prev) => (prev = { ...prev, ketua: candidate.ketua }))
    setValues((prev) => (prev = { ...prev, wakil: candidate.wakil }))
    setValues((prev) => (prev = { ...prev, visi: candidate.visi }))
    setValues((prev) => (prev = { ...prev, misi: candidate.misi }))
    setFileName((prev) => (prev = candidate.thumbnail))
  }

  const onUpdateCandidate = async (e) => {
    e.preventDefault()

    if (currentStep !== 1) return onNextStep()

    const fd = new FormData()

    fd.append("ketua", ketua)
    fd.append("wakil", wakil)
    fd.append("visi", visi)
    fd.append("misi", misi)
    fd.append("thumbnail", file)

    if (session) {
      try {
        const response = await fetch(
          `/api/votings/updateCandidate/${selectedCandidateId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
            body: fd,
          }
        )

        const data = await response.json()

        const candidate = data.candidateForVotings

        setCandidatesForVotings((prev) =>
          prev.map((obj) =>
            obj._id === candidate._id ? { ...obj, ...candidate } : obj
          )
        )

        if (response.ok) {
          setValues((prev) => (prev = { ...prev, ketua: "" }))
          setValues((prev) => (prev = { ...prev, wakil: "" }))
          setValues((prev) => (prev = { ...prev, visi: "" }))
          setValues((prev) => (prev = { ...prev, misi: "" }))
          setFile(null)
          setFileName("")
          setCurrentStep(0)
          setIsOpen(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const [endPeriod, setEndPeriod] = useState("")
  const [date, setDate] = useState("")

  const onSetEndPeriod = () => {
    localStorage.setItem("endPeriod", endPeriod)
  }

  useEffect(() => {
    setDate(localStorage.getItem("endPeriod"))
  }, [endPeriod])

  return (
    <>
      <div className="mb-10">
        <div className="flex justify-between mb-3">
          <div>
            <h1 className="font-semibold text-lg mb-3">
              Kandidat Ketua & Wakil Ketua
            </h1>
            Batas Waktu Voting : <span className="text-green-500">{date}</span>
          </div>
          <div className="flex items-center gap-x-3">
            <input
              type="date"
              value={endPeriod}
              className="rounded-md border border-primary focus:outline-primary py-2 px-4"
              onChange={(e) => setEndPeriod(e.target.value)}
            />
            <button
              onClick={onSetEndPeriod}
              className={`border border-primary text-primary font-semibold rounded-md py-2 px-4 ${
                !endPeriod && "opacity-50"
              }`}
              disabled={!endPeriod ? true : false}
            >
              Atur Batas Waktu Voting
            </button>
            <button
              onClick={prepAddCandidate}
              className="bg-primary text-white flex items-center gap-x-1 font-semibold rounded-md py-2 px-4"
            >
              <MdAdd size={20} />
              Add Candidate
            </button>
          </div>
        </div>

        {!candidatesForVotings.length ? (
          <div className="border-l-4 border-primary">
            <div className="border rounded-y-md rounded-r-md py-3 px-5">
              <p className="text-gray-500">
                Data kandidat Ketua & Wakil Ketua BEM FTK masih kosong, silahkan
                tambahkan melalui tombol
                <span className="font-semibold text-primary">
                  Add Candidate!
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {candidatesForVotings.map((obj, i) => (
              <div key={i} className="rounded-md border flex">
                <Image
                  src={`/thumbnails/${obj.thumbnail}`}
                  alt={"thubmnail"}
                  width={125}
                  height={150}
                />
                <div className="w-full p-3">
                  <div className="w-full flex justify-between">
                    <h1 className="font-bold text-lg">Kandidat No.{i + 1}</h1>
                    <HiOutlineDotsVertical
                      size={20}
                      className="text-gray-400"
                    />
                  </div>
                  <h1 className="font-semibold">{obj.ketua}</h1>
                  <h1 className="font-semibold">{obj.wakil}</h1>
                  <h1 className="text-gray-500 text-sm">Lihat Visi & Misi</h1>
                  <div className="flex gap-x-3 mt-3">
                    <MdEditNote
                      onClick={() => prepCandidateBeforeUpdate(obj)}
                      size={25}
                      className="hover:text-primary duration-300 cursor-pointer"
                    />
                    <MdDeleteSweep
                      onClick={() => onDeleteCandidate(obj._id)}
                      size={25}
                      className="text-red-500 hover:text-red-700 duration-300 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between place-items-center mb-5">
        <div className="flex items-center gap-x-3 border py-2 px-4 rounded-lg">
          <MdFilterList size={20} />
          <span>Filter</span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MdSearch size={20} />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="border pl-10 py-2 px-4 rounded-lg focus:outline-primary"
          />
        </div>
      </div>
      <div className="rounded-md overvlow-x-auto border border-slate-100">
        <table className="table-auto w-full text-left rounded-md overflow-hidden">
          <thead className="bg-gray-50 rounded-md border-b">
            <tr>
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Foto</th>
              <th className="py-2 px-4">Nama</th>
              <th className="py-2 px-4">Divisi</th>
              <th className="py-2 px-4">Jabatan</th>
              <th className="py-2 px-4">Berkas</th>
              <th className="py-2 px-4">Status Pendaftaran</th>
            </tr>
          </thead>
          <tbody>
            {candidates?.map((candidate, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-2 px-4">{i + 1}</td>
                <td className="py-2 px-4">Foto</td>
                <td className="py-2 px-4">{candidate.user.name}</td>
                <td className="py-2 px-4">{candidate.divisi}</td>
                <td className="py-2 px-4">{candidate.jabatan}</td>
                <td className="py-2 px-4">
                  <Link
                    href={`/uploads/${candidate.berkas}`}
                    target="_blank"
                    download
                    className="flex justify-between items-center"
                  >
                    {candidate.berkas}
                    <MdDownload size={25} />
                  </Link>
                </td>
                <td className="py-2 px-4">
                  <span
                    className={`rounded-md px-2 font-semibold text-white ${
                      candidate.statusPendaftaran === "Lulus Seleksi I"
                        ? "bg-blue-400"
                        : candidate.statusPendaftaran === "Terpilih" &&
                          "bg-green-400"
                    }`}
                  >
                    {candidate.statusPendaftaran}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title={
          !isUpdate
            ? "Add Candidate for Votings"
            : "Update Candidate for Votings"
        }
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        {currentStep === 0 && (
          <>
            <form onSubmit={!isUpdate ? onAddCandidate : onUpdateCandidate}>
              {inputs.map((input, i) => (
                <FormInput
                  key={i}
                  {...input}
                  value={values[input.name]}
                  onChange={onChange}
                />
              ))}
              <div className="mb-5">
                <label>Foto Kandidat</label>
                <label htmlFor="file">
                  <div className="rounded-md border drop-shadow-sm flex items-center gap-x-5">
                    <div className="w-fit py-3 px-5 border-r flex items-center gap-x-2 cursor-pointer">
                      <MdOutlineFileUpload size={20} />
                      Upload
                    </div>
                    <span>{fileName}</span>
                  </div>
                </label>
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={onFileChange}
                />
              </div>
              <Button
                text={"Next"}
                defaultBgColor={"bg-black"}
                defaultTxtColor={"text-white"}
                hoverColor={"bg-primary"}
              />
            </form>
          </>
        )}
        {currentStep === 1 && (
          <>
            <button
              onClick={onBackStep}
              className="inline-flex items-center gap-x-3 mb-5 hover:text-primary duration-200"
            >
              <HiOutlineArrowNarrowLeft size={25} />
              <span className="font-semibold text-primary">Back</span>
            </button>
            <form onSubmit={!isUpdate ? onAddCandidate : onUpdateCandidate}>
              <div className="mb-5">
                <div>
                  <label>Visi</label>
                  <textarea
                    required
                    name="visi"
                    value={values.visi}
                    placeholder="Masukan visi kandidat."
                    className="w-full py-3 px-5 rounded-md border focus:outline-primary"
                    onChange={onChange}
                  ></textarea>
                </div>
                <div>
                  <label>Misi</label>
                  <textarea
                    required
                    name="misi"
                    value={values.misi}
                    placeholder="Masukan misi kandidat."
                    className="w-full py-3 px-5 rounded-md border focus:outline-primary"
                    onChange={onChange}
                  ></textarea>
                </div>
              </div>
              <div className="flex items-center gap-x-5">
                <div className="w-full">
                  <Button
                    text={!isUpdate ? "Submit" : "Update"}
                    defaultBgColor={"bg-black"}
                    defaultTxtColor={"text-white"}
                    hoverColor={"bg-primary"}
                  />
                </div>
              </div>
            </form>
          </>
        )}
      </Modal>
    </>
  )
}

CandidatePage.getAdminLayout = function (page) {
  return <>{page}</>
}
