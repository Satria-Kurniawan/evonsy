import Link from "next/link"
import {
  MdDashboard,
  MdAddTask,
  MdOutlinePeopleAlt,
  MdAnnouncement,
} from "react-icons/md"
import { useRouter } from "next/router"

const Sidebar = ({ isOpen }) => {
  const router = useRouter()

  const menus = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <MdDashboard size={25} />,
    },
    {
      name: "Perekrutan",
      path: "/admin/recruitments",
      icon: <MdAddTask size={25} />,
    },
    {
      name: "Kandidat",
      path: "/admin/candidates",
      icon: <MdOutlinePeopleAlt size={25} />,
    },
    {
      name: "Pengumuman",
      path: "/admin/announcements",
      icon: <MdAnnouncement size={25} />,
    },
  ]

  return (
    <aside
      className={`h-[86vh] p-6 overflow-y-auto ${isOpen ? "w-72" : "w-24"}`}
    >
      <ul className="flex flex-col gap-y-1">
        {menus.map((menu, i) => (
          <li
            key={i}
            className={`${
              router.pathname === menu.path &&
              isOpen &&
              "border-l-[3px] border-primary"
            }`}
          >
            <Link href={menu.path}>
              <div
                className={`rounded-md flex items-center gap-x-5 py-2 hover:bg-primary hover:text-white hover:px-3 cursor-pointer transition-all duration-300 ${
                  router.pathname === menu.path
                    ? isOpen
                      ? "text-primary pl-3"
                      : "text-primary"
                    : ""
                }`}
              >
                <span className="z-10">{menu.icon}</span>
                <span className={`${!isOpen && "hidden"}`}>{menu.name}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
