import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { MdAnnouncement } from "react-icons/md"

export default function AnnouncementsPage() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    fetch("/api/announcements")
      .then((response) => {
        if (response.ok) return response.json()
      })
      .then((data) => setAnnouncements(data.announcements))
      .catch((error) => console.log(error))
  }, [])

  return (
    <div className="my-10">
      <div className="max-w-[18rem] mx-auto text-center font-bold text-2xl mb-3">
        <span>Pengumuman PEMIRA </span>
        <span>BEM FTK </span>
        <span className="text-primary">Undiksha</span>
      </div>
      <div className="w-16 mx-auto border-b-4 border-primary rounded-full"></div>
      <section className="mt-20 flex flex-col gap-y-5">
        {announcements.map((announcement, i) => (
          <div
            key={i}
            onClick={() =>
              router.push({
                pathname: "announcements/detail",
                query: { id: announcement._id },
              })
            }
            className="mx-auto min-w-[30rem] max-w-[30rem] border-l-[6px] border-l-primary bg-gray-100 py-2 px-4 cursor-pointer"
          >
            <div className="flex items-center gap-x-5">
              <MdAnnouncement size={40} />
              <div>
                <h1 className="text-lg font-bold">{announcement.title}</h1>
                <h2 className="text-gray-600">{announcement.subtitle}</h2>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
