import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { MdSettings, MdDownload, MdSearch, MdFilterList } from "react-icons/md"
import Link from "next/link"
import Modal from "../../components/Modal"
import Image from "next/image"
import Button from "../../components/Button"

export default function RecruitmentPage() {
  const { data: session } = useSession()
  const [candidates, setCandidates] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState({})

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

          setCandidates(data.candidates)
        } catch (error) {
          console.log(error)
        }
      }
    }

    getCandidates()
  }, [session])

  const onSelectCandidate = (candidate) => {
    setIsOpen(true)
    setSelectedCandidate(candidate)
  }

  const onSeleksi = async (value) => {
    if (session) {
      try {
        const response = await fetch(
          `/api/candidates/selections/${selectedCandidate._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({ statusPendaftaran: value }),
          }
        )
        const data = await response.json()

        const newState = candidates.map((obj) =>
          obj._id === data.candidate._id
            ? { ...obj, statusPendaftaran: data.candidate.statusPendaftaran }
            : obj
        )

        setCandidates(newState)
      } catch (error) {
        console.log(error)
      }
    }

    setIsOpen(false)
  }

  return (
    <>
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
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {candidates?.map((candidate, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-2 px-4">
                  <input type="checkbox" />
                </td>
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
                      candidate.statusPendaftaran === "Seleksi Administrasi"
                        ? "bg-yellow-300"
                        : candidate.statusPendaftaran === "Lulus Administrasi"
                        ? "bg-blue-300"
                        : candidate.statusPendaftaran === "Lulus Seleksi I"
                        ? "bg-blue-400"
                        : candidate.statusPendaftaran === "Terpilih"
                        ? "bg-green-400"
                        : "bg-red-500"
                    }`}
                  >
                    {candidate.statusPendaftaran}
                  </span>
                </td>
                <td
                  onClick={() => onSelectCandidate(candidate)}
                  className="py-2 px-4 cursor-pointer"
                >
                  <MdSettings size={25} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={isOpen}
        title={
          selectedCandidate.statusPendaftaran === "Seleksi Administrasi" ? (
            "Seleksi Administrasi"
          ) : (
            <>
              <span>Seleksi Wawancara</span>
              <p className="font-normal text-sm text-gray-500 max-w-[30rem]">
                {selectedCandidate.divisi === "Umum" &&
                selectedCandidate.jabatan === "Ketua & Wakil"
                  ? 'Untuk divisi "Umum" dengan pilihan jabatan "Ketua & Wakil" yang lulus seleksi wawancara akan lanjut ke tahap berikutnya hingga tahapan terakhir yaitu voting.'
                  : 'Apabila "Lulus" seleksi wawancara maka secara otomatis kandidat akan terpilih sebagai anggota kepengurusan sesuai divisi dan jabatannya.'}
              </p>
            </>
          )
        }
        onClose={() => setIsOpen(false)}
      >
        <div className="flex gap-x-3 mb-5">
          <Image
            src={"/Satria.png"}
            alt={"Profile"}
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <span className="font-semibold text-lg">
              {selectedCandidate.user?.name}
            </span>
            <p className="text-gray-500 text-sm">
              {selectedCandidate.user?.prodi}
            </p>
          </div>
        </div>
        <div className="mb-5">
          <table>
            <tbody>
              <tr>
                <td className="font-semibold">Divisi yang dipilih</td>
                <td className="px-4">:</td>
                <td>{selectedCandidate?.divisi}</td>
              </tr>
              <tr>
                <td className="font-semibold">Jabatan yang dipilih</td>
                <td className="px-4">:</td>
                <td>{selectedCandidate?.jabatan}</td>
              </tr>
              <tr>
                <td className="font-semibold">Berkas</td>
                <td className="px-4">:</td>
                <td>{selectedCandidate?.berkas}</td>
                <td className="pl-2">
                  <Link
                    href={`/uploads/${selectedCandidate.berkas}`}
                    target="_blank"
                    download
                  >
                    <MdDownload />
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex gap-x-5">
          <div onClick={() => onSeleksi("Tidak Lulus")}>
            <Button
              text={"Tidak Lulus"}
              defaultTxtColor={"text-red-500"}
              borderColor={"border-red-500"}
              hoverColor={"bg-red-500"}
            />
          </div>
          <div
            onClick={() =>
              selectedCandidate.statusPendaftaran === "Seleksi Administrasi"
                ? onSeleksi("Seleksi Administrasi")
                : selectedCandidate.divisi !== "Umum" &&
                  selectedCandidate.jabatan !== "Ketua & Wakil Ketua"
                ? onSeleksi("Terpilih")
                : onSeleksi("Lulus Seleksi I")
            }
          >
            <Button
              text={"Lulus"}
              defaultTxtColor={"text-green-500"}
              borderColor={"border-green-500"}
              hoverColor={"bg-green-500"}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

RecruitmentPage.getAdminLayout = function (page) {
  return <>{page}</>
}
