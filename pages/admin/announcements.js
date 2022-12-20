import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"

import {
  MdAdd,
  MdDeleteSweep,
  MdEditNote,
  MdOutlineFileUpload,
} from "react-icons/md"

import Modal from "../../components/Modal"
import FormInput from "../../components/FormInput"
import Button from "../../components/Button"

export default function AnnouncementPage() {
  const { data: session } = useSession()
  const [openModal, setOpenModal] = useState(false)
  const [values, setValues] = useState({
    title: "",
    subtitle: "",
    content: "",
  })
  const [announcements, setAnnouncements] = useState([])

  const { title, subtitle, content } = values

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

  const prepCreateAnnouncement = () => {
    setOpenModal(true)
    setIsUpdate(false)
    setValues((prev) => (prev = { ...prev, title: "" }))
    setValues((prev) => (prev = { ...prev, subtitle: "" }))
    setValues((prev) => (prev = { ...prev, content: "" }))
    setFile(null)
    setFileName("")
  }

  const inputs = [
    {
      label: "Judul",
      type: "text",
      name: "title",
      placeholder: "Masukan judul pengumuman.",
      errorMessage: "Judul wajib diisi!",
      required: true,
    },
    {
      label: "Sub Judul",
      type: "text",
      name: "subtitle",
      placeholder: "Masukan sub judul pengumuman.",
      errorMessage: "Judul wajib diisi!",
      required: true,
    },
  ]

  const onCreateAnnouncement = async (e) => {
    e.preventDefault()

    const fd = new FormData()

    fd.append("title", title)
    fd.append("subtitle", subtitle)
    fd.append("content", content)
    fd.append("image", file)

    if (session) {
      try {
        const response = await fetch(`/api/announcements/createAnnouncement`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: fd,
        })

        const data = await response.json()

        const announcement = data.announcement

        setAnnouncements([...announcements, announcement])

        if (response.ok) {
          setValues((prev) => (prev = { ...prev, title: "" }))
          setValues((prev) => (prev = { ...prev, subtitle: "" }))
          setValues((prev) => (prev = { ...prev, content: "" }))
          setFile(null)
          setFileName("")
          setOpenModal(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    fetch("/api/announcements")
      .then((response) => {
        if (response.ok) return response.json()
      })
      .then((data) => setAnnouncements(data.announcements))
      .catch((error) => console.log(error))
  }, [])

  const [isUpdate, setIsUpdate] = useState(false)
  const [selectedId, setSelectedId] = useState("")

  const prepAnnouncementBeforeUpdate = (announcement) => {
    setIsUpdate(true)
    setOpenModal(true)
    setSelectedId(announcement._id)
    setValues((prev) => (prev = { ...prev, title: announcement.title }))
    setValues((prev) => (prev = { ...prev, subtitle: announcement.subtitle }))
    setValues((prev) => (prev = { ...prev, content: announcement.content }))
    setFileName(announcement.image)
  }

  const onUpdateAnnouncement = async (e) => {
    e.preventDefault()

    const fd = new FormData()

    fd.append("title", title)
    fd.append("subtitle", subtitle)
    fd.append("content", content)
    fd.append("image", file)

    if (session) {
      try {
        const response = await fetch(
          `/api/announcements/updateAnnouncement/${selectedId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
            body: fd,
          }
        )

        const data = await response.json()

        const announcement = data.updatedAnnouncement

        setAnnouncements((prev) =>
          prev.map((obj) =>
            obj._id === announcement._id ? { ...obj, ...announcement } : obj
          )
        )

        if (response.ok) {
          setValues((prev) => (prev = { ...prev, title: "" }))
          setValues((prev) => (prev = { ...prev, subtitle: "" }))
          setValues((prev) => (prev = { ...prev, content: "" }))
          setFile(null)
          setFileName("")
          setOpenModal(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const onDeleteAnnouncement = async (id) => {
    try {
      const response = await fetch(
        `/api/announcements/deleteAnnouncement/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      )

      setAnnouncements((prev) => prev.filter(({ _id }) => _id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className="flex justify-between mb-5">
        <h1 className="font-semibold text-lg">Pengumuman Hasil Pemira</h1>
        <button
          onClick={prepCreateAnnouncement}
          className="bg-primary text-white flex items-center gap-x-1 font-semibold rounded-md py-2 px-4"
        >
          <MdAdd size={20} />
          Buat Pengumuman
        </button>

        <Modal
          title={!isUpdate ? "Buat Pengumuman" : "Update Pengumuman"}
          open={openModal}
          onClose={() => setOpenModal(false)}
        >
          <form
            onSubmit={!isUpdate ? onCreateAnnouncement : onUpdateAnnouncement}
          >
            {inputs.map((input, i) => (
              <FormInput
                key={i}
                {...input}
                value={values[input.name]}
                onChange={onChange}
              />
            ))}
            <div className="mb-3">
              <label>Isi</label>
              <textarea
                name="content"
                placeholder="Isi pengumuman."
                className="w-full border rounded-md py-3 px-5 focus:outline-primary"
                rows={5}
                value={values.content}
                onChange={onChange}
              ></textarea>
            </div>
            <div className="mb-5">
              <label>Gambar</label>
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
            <div className="w-full">
              <Button
                text={!isUpdate ? "Submit" : "Update"}
                defaultBgColor={"bg-black"}
                defaultTxtColor={"text-white"}
                hoverColor={"bg-primary"}
              />
            </div>
          </form>
        </Modal>
      </div>

      <div className="grid grid-cols-2 gap-x-5">
        {announcements.map((announcement, i) => (
          <div key={i} className="rounded-md flex gap-x-5">
            <Image
              src={`/uploads/${announcement.image}`}
              alt="Pengumuman"
              width={200}
              height={400}
              className="rounded-md"
            />
            <div className="p-1">
              <h1 className="font-bold text-xl">{announcement.title}</h1>
              <h2 className="font-semibold text-lg text-gray-500">
                {announcement.subtitle}
              </h2>
              <p className="text-gray-500">
                {announcement.content.slice(0, 100) + "..."}
              </p>
              <div className="flex gap-x-3 mt-3">
                <MdEditNote
                  onClick={() => prepAnnouncementBeforeUpdate(announcement)}
                  size={25}
                  className="hover:text-primary duration-300 cursor-pointer"
                />
                <MdDeleteSweep
                  onClick={() => onDeleteAnnouncement(announcement._id)}
                  size={25}
                  className="text-red-500 hover:text-red-700 duration-300 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

AnnouncementPage.getAdminLayout = function (page) {
  return <>{page}</>
}
