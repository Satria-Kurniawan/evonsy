import Image from "next/image"
import logobemftk from "../../public/logo-bemftk.png"
import avatar from "../../public/Satria.png"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { IoCaretDownCircleSharp } from "react-icons/io5"
import { CgSoftwareDownload } from "react-icons/cg"
import Button from "../../components/Button"
import Link from "next/link"
import Waiting from "../../components/Waiting"
import { toast } from "react-toastify"

export default function OpenRecruitmentPage() {
  const { data: session } = useSession()
  const [isWaiting, setIsWaiting] = useState(false)

  const [openDivisi, setOpenDivisi] = useState(false)
  const [openJabatan, setOpenJabatan] = useState(false)
  const [openBerkas, setOpenBerkas] = useState(false)

  const divisiRef = useRef()
  const jabatanRef = useRef()
  const berkasRef = useRef()

  const divisi = [
    "Umum",
    "Pendidikan dan Penalaran",
    "Pengembangan Sumber Daya Manusia",
  ]

  const jabatan = ["Ketua & Wakil", "Sekretaris", "Bendahara"]

  const berkas = [
    { name: "KHS (Kartu Hasil Studi)", required: true },
    { name: "CV (Curriculum Vitae)", required: false },
    { name: "Foto", required: true },
    { name: "Materai", required: true },
  ]

  const [selected, setSelected] = useState({
    divisi: "Pilih divisi",
    jabatan: "Pilih jabatan",
    berkas: "Kumpulkan Berkas",
  })

  const [file, setFile] = useState(null)

  const selectDivisi = (item) => {
    setSelected((prev) => ({ ...prev, divisi: item }))
  }

  const selectJabatan = (item) => {
    setSelected((prev) => ({ ...prev, jabatan: item }))
  }

  useEffect(() => {
    const handleOutsideDivisi = (e) => {
      if (divisiRef.current && !divisiRef.current.contains(e.target))
        setOpenDivisi(false)
    }

    document.addEventListener("click", handleOutsideDivisi)

    return () => document.removeEventListener("click", handleOutsideDivisi)
  }, [divisiRef])

  useEffect(() => {
    const handleClickOutsideJabatan = (e) => {
      if (jabatanRef.current && !jabatanRef.current.contains(e.target))
        setOpenJabatan(false)
    }

    document.addEventListener("click", handleClickOutsideJabatan)

    return () =>
      document.removeEventListener("click", handleClickOutsideJabatan)
  }, [jabatanRef])

  useEffect(() => {
    const handleClickOutsideBerkas = (e) => {
      if (berkasRef.current && !berkasRef.current.contains(e.target))
        setOpenBerkas(false)
    }

    document.addEventListener("click", handleClickOutsideBerkas)

    return () => document.removeEventListener("click", handleClickOutsideBerkas)
  }, [berkasRef])

  const onFileSelected = (e) => {
    if (!e.target.files.length > 0) return

    setFile(e.target.files[0])
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const fd = new FormData()

    fd.append("divisi", selected.divisi)
    fd.append("jabatan", selected.jabatan)
    fd.append("berkas", file)

    if (session) {
      setIsWaiting(true)
      try {
        const response = await fetch("/api/candidates/register", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: fd,
        })

        const data = await response.json()
        if (!response.ok) return toast.error(data.error.message)
        toast.success(data.message)
      } finally {
        setIsWaiting(false)
      }
    }
  }

  return (
    <div className="grid grid-cols-2 my-20">
      <div>
        <Image src={logobemftk} alt={"logo bem ftk"} width={100} height={100} />
        <div className="max-w-md mt-5">
          <div className="font-bold text-3xl">
            <span>Daftar menjadi anggota organisasi </span>
            <span className="text-primary">BEM FTK</span>
          </div>
          <p className="text-gray-500 mb-10">
            Lengkapi formulir disamping untuk melakukan pendaftaran
          </p>
          <div className="flex items-center gap-x-3">
            <Image
              src={avatar}
              alt={"avatar"}
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <h1 className="font-bold text-xl">{session?.user.name}</h1>
              <h1 className="text-gray-500">Ilmu Komputer</h1>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={onSubmit}>
        <div ref={divisiRef}>
          <div
            className={`w-full bg-gray-100 rounded-t-md py-3 px-5 flex items-center justify-between cursor-pointer ${
              openDivisi ? "border-b" : "rounded-b-md"
            }`}
            onClick={() => setOpenDivisi(!openDivisi)}
          >
            <span>{selected.divisi}</span>
            <IoCaretDownCircleSharp
              size={25}
              className={`${openDivisi && "rotate-180"} duration-300`}
            />
          </div>
          <div
            className={`bg-gray-100 py-3 px-5 rounded-b-md ${
              !openDivisi
                ? "opacity-0 -translate-y-5 pointer-events-none -mb-3"
                : "opacity-100 mb-3"
            } duration-300`}
          >
            {openDivisi &&
              divisi.map((obj, i) => (
                <div
                  key={i}
                  onClick={() => selectDivisi(obj)}
                  className="hover:bg-primary py-1.5 hover:px-3 hover:text-white rounded-md cursor-pointer duration-300"
                >
                  <span>{obj}</span>
                </div>
              ))}
          </div>
        </div>
        <div ref={jabatanRef}>
          <div
            className={`w-full bg-gray-100 rounded-t-md py-3 px-5 flex items-center justify-between cursor-pointer ${
              openJabatan ? "border-b" : "rounded-b-md"
            }`}
            onClick={() => setOpenJabatan(!openJabatan)}
          >
            <span>{selected.jabatan}</span>
            <IoCaretDownCircleSharp
              size={25}
              className={`${openJabatan && "rotate-180"} duration-300`}
            />
          </div>
          <div
            className={`bg-gray-100 py-3 px-5 rounded-b-md ${
              !openJabatan
                ? "opacity-0 -translate-y-5 pointer-events-none -mb-3"
                : "opacity-100 mb-3"
            } duration-300`}
          >
            {openJabatan &&
              jabatan.map((obj, i) => (
                <div
                  key={i}
                  onClick={() => selectJabatan(obj)}
                  className="hover:bg-primary py-1.5 hover:px-3 hover:text-white rounded-md cursor-pointer duration-300"
                >
                  <span>{obj}</span>
                </div>
              ))}
          </div>
        </div>
        <div ref={berkasRef}>
          <div
            className={`w-full bg-gray-100 rounded-t-md py-3 px-5 flex items-center justify-between cursor-pointer ${
              openBerkas ? "border-b" : "rounded-b-md"
            }`}
            onClick={() => setOpenBerkas(!openBerkas)}
          >
            <span>{selected.berkas}</span>
            <IoCaretDownCircleSharp
              size={25}
              className={`${openBerkas && "rotate-180"} duration-300`}
            />
          </div>
          <div
            className={`bg-gray-100 py-3 px-5 rounded-b-md ${
              !openBerkas
                ? "opacity-0 -translate-y-5 pointer-events-none -mb-10"
                : "opacity-100 mb-3"
            } duration-300 flex justify-between`}
          >
            <div>
              {openBerkas &&
                berkas.map((obj, i) => (
                  <div key={i} onClick={() => ""} className="py-1.5 rounded-md">
                    <div>
                      <span className="text-gray-500">{obj.name}</span>
                      <span
                        className={`${
                          obj.required ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        {obj.required ? " *" : " - Optional"}
                      </span>
                    </div>
                  </div>
                ))}
              <div className="max-w-[8rem]">
                <input type="file" onChange={onFileSelected} />
                {/* <Button text={"Upload"} defaultTxtColor={"text-primary"} /> */}
              </div>
            </div>
            <div>
              <Link
                href={"/uploads/Template_Berkas_BEM.docx"}
                target="_blank"
                download
              >
                <div className="flex items-center gap-x-3 cursor-pointer">
                  <span className="text-primary">Download Template</span>
                  <CgSoftwareDownload size={20} />
                </div>
              </Link>
            </div>
          </div>
        </div>
        {isWaiting ? (
          <div className="flex justify-center">
            <Waiting />
          </div>
        ) : (
          <Button
            text={"Submit"}
            defaultBgColor={"bg-primary"}
            defaultTxtColor={"text-white"}
          />
        )}
      </form>
    </div>
  )
}
