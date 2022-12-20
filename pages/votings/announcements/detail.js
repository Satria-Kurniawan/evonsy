import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import Image from "next/image"

import { FaChevronRight } from "react-icons/fa"

export default function DetailAnnouncementPage() {
  const router = useRouter()
  const [announcement, setAnnouncement] = useState({})
  const [winners, setWinners] = useState([])

  useEffect(() => {
    if (router.isReady) {
      fetch(`/api/announcements/${router.query.id}`)
        .then((response) => {
          if (response.ok) return response.json()
        })
        .then((data) => setAnnouncement(data.announcement))
        .catch((error) => console.log(error))
    }
  }, [router.isReady])

  useEffect(() => {
    fetch(`/api/candidates`)
      .then((response) => {
        if (response.ok) return response.json()
      })
      .then((data) =>
        setWinners(
          data.candidates.filter(
            ({ statusPendaftaran }) => statusPendaftaran === "Terpilih"
          )
        )
      )
      .catch((error) => console.log(error))
  }, [])

  console.log(winners)

  return (
    <div className="my-10">
      <div className="flex items-center gap-x-3 mb-10">
        <span
          onClick={() => router.push("/votings/announcements")}
          className="font-bold text-2xl cursor-pointer"
        >
          Pengumuman
        </span>
        <FaChevronRight size={20} />
        <span className="font-bold text-2xl text-primary">
          {announcement.title}
        </span>
      </div>
      <div className="flex gap-x-10 mb-10">
        <Image
          src={`/uploads/${announcement.image}`}
          alt="image"
          width={200}
          height={400}
        />
        <div className="max-w-lg">
          <h1 className="font-bold text-xl">{announcement.subtitle}</h1>
          <p className="text-gray-500">{announcement.content}</p>
        </div>
      </div>
      <div>
        <div className="flex justify-end mb-5">
          <div>
            <h1 className="font-bold text-lg mb-3">
              Daftar Anggota yang Terpilih
            </h1>
            <div className="w-16 ml-auto border-b-4 border-primary rounded-full"></div>
          </div>
        </div>
        <div className="rounded-md overvlow-x-auto border border-slate-100">
          <table className="table-auto w-full text-left rounded-md overflow-hidden">
            <thead className="bg-black text-white rounded-md border-b">
              <tr>
                <th className="py-2 px-4">Nama</th>
                <th className="py-2 px-4">Divisi</th>
                <th className="py-2 px-4">Jabatan</th>
                <th className="py-2 px-4">Prodi</th>
                <th className="py-2 px-4">Jurusan</th>
              </tr>
            </thead>
            <tbody>
              {winners?.map((winner, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2 px-4">{winner.user.name}</td>
                  <td className="py-2 px-4">{winner.divisi}</td>
                  <td className="py-2 px-4">{winner.jabatan}</td>
                  <td className="py-2 px-4">{winner.user.prodi}</td>
                  <td className="py-2 px-4">{winner.user.jurusan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
