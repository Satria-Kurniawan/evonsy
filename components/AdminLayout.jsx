import { useState } from "react"
import Link from "next/link"
import Sidebar from "./Sidebar"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { MdNotifications } from "react-icons/md"

const AdminLayout = ({ children, onAddCandidate }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <header className="flex items-start p-6">
        <div className="flex items-center gap-x-7 font-bold text-2xl w-72">
          <button onClick={() => setIsOpen(!isOpen)} className="relative group">
            <div className="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden">
              <div
                className={`bg-black h-[2px] w-7 transform transition-all duration-300 origin-left ${
                  isOpen && "translate-x-10"
                }`}
              ></div>
              <div
                className={`bg-black h-[2px] w-7 rounded transform transition-all duration-300 ${
                  isOpen && "translate-x-10 delay-75"
                }`}
              ></div>
              <div
                className={`bg-black h-[2px] w-7 transform transition-all duration-300 origin-left ${
                  isOpen && "translate-x-10"
                } delay-150`}
              ></div>

              <div
                className={`absolute items-center justify-between transform transition-all duration-500 top-2.5 -translate-x-10 ${
                  isOpen && "translate-x-0 w-12"
                }   flex w-0 `}
              >
                <div
                  className={`absolute bg-black h-[2px] w-5 transform transition-all duration-500 rotate-0 delay-300 ${
                    isOpen && "rotate-45"
                  }`}
                ></div>
                <div
                  className={`absolute bg-black h-[2px] w-5 transform transition-all duration-500 -rotate-0 delay-300 ${
                    isOpen && "-rotate-45"
                  }`}
                ></div>
              </div>
            </div>
          </button>
          <div>
            <Link href="/">
              <span>Evonsy</span> <span className="text-primary">Admin</span>
            </Link>
          </div>
        </div>
        <div className="w-full flex justify-between items-start">
          <div className="ml-10">
            <h1 className="font-bold text-2xl capitalize">
              {router.pathname.split("/")[2]} Page
            </h1>
            <p className="text-gray-500">{router.pathname}</p>
          </div>
          <div className="flex items-center gap-x-3">
            <MdNotifications size={20} />
            <span className="text-lg">{session?.user.name}</span>
          </div>
        </div>
      </header>
      <div className="flex">
        <Sidebar isOpen={isOpen} />
        <main className="w-full py-7 pr-10 h-[86vh]">{children}</main>
      </div>
    </>
  )
}

export default AdminLayout
