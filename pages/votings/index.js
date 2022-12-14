import { FaChartPie } from "react-icons/fa"
import { MdHowToVote, MdAnnouncement } from "react-icons/md"
import { HiOutlineArrowNarrowRight } from "react-icons/hi"
import Link from "next/link"
import Countdown from "react-countdown"
import { useEffect, useState } from "react"

export default function VotingPage() {
  const menus = [
    {
      name: "Live Count",
      description: "Menampilkan persentase pemungutan suara secara real time",
      icon: <FaChartPie size={50} className="mx-auto" />,
      path: "/votings/livecount",
    },
    {
      name: "Voting",
      description:
        "Setiap mahasiswa wajib melakukan voting dengan kesempatan maksimal sekali",
      icon: <MdHowToVote size={50} className="mx-auto" />,
      path: "/votings/candidates",
    },
    {
      name: "Pengumuman",
      description:
        "Menampilkan hasil akhir dari pemilihan Ketua dan Wakil Ketua BEM FTK",
      icon: <MdAnnouncement size={50} className="mx-auto" />,
      path: "/votings/announcements",
    },
  ]

  const [isOver, setIsOver] = useState(false)

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="absolute -top-3 -right-3">
          <span className="border bg-red-500 text-white py-1 px-2 rounded-md">
            Telah Berakhir
          </span>
        </div>
      )
    } else {
      // Render a countdown
      return (
        <div className="absolute -top-3 -right-3">
          <span className="border border-green-500 text-green-500 py-1 px-2 rounded-md">
            Berakhir dalam {days}:{hours}:{minutes}:{seconds}
          </span>
        </div>
      )
    }
  }

  const [endPeriod, setIsEndPeriod] = useState("")

  useEffect(() => {
    setIsEndPeriod(JSON.stringify(localStorage.getItem("endPeriod")))
  }, [])

  return (
    <>
      <div className="my-10">
        <div className="max-w-xs mx-auto text-center font-bold text-2xl mb-3">
          <span>Electronic Voting System </span>
          <span>BEM FTK </span>
          <span className="text-primary">Undiksha</span>
        </div>
        <div className="w-16 mx-auto border-b-4 border-primary rounded-full"></div>
        <section className="mt-20">
          <div className="mx-auto grid grid-cols-3 gap-x-5 max-w-[52rem]">
            {menus.map((menu, i) => (
              <div key={i} className="rounded-md shadow-md drop-shadow-sm p-7">
                {menu.name === "Voting" && (
                  <Countdown
                    date={new Date(endPeriod)}
                    renderer={renderer}
                    onComplete={() => setIsOver(true)}
                  />
                )}
                <div className="mb-10">{menu.icon}</div>
                <h1 className="font-bold text-2xl text-primary">{menu.name}</h1>
                <p className="text-gray-500">{menu.description}</p>

                {isOver && menu.name === "Voting" ? (
                  <div className="mt-5 text-red-500">Selesai</div>
                ) : (
                  <>
                    <Link href={menu.path}>
                      <div className="mt-5 flex items-center gap-x-2 text-sm text-primary hover:text-black hover:pl-3">
                        <button>View More</button>
                        <HiOutlineArrowNarrowRight size={20} />
                      </div>
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
