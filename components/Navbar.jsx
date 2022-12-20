import Link from "next/link"
import { Link as LinkRs } from "react-scroll"
import Button from "./Button"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Image from "next/image"
import logoBemFtk from "../public/logo-bemftk.png"
import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"

const Navbar = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const isAthenticated = status === "authenticated"

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    document.addEventListener("scroll", () => {
      window.scrollY > 20 ? setIsScrolled(true) : setIsScrolled(false)
    })
  }, [isScrolled])

  return (
    <nav className={`sticky top-0 z-50 ${isScrolled ? "bg-white" : ""}`}>
      <div className="container mx-auto px-20">
        <div className="flex justify-between py-3">
          <ul className="inline-flex gap-5 items-center">
            <li className="pb-2 pr-5">
              <Image src={logoBemFtk} width={40} height={40} alt={"BEM FTK"} />
            </li>
            {router.pathname !== "/" && (
              <li className="pb-2 cursor-pointer">
                <Link href="/">
                  <span>Beranda</span>
                </Link>
              </li>
            )}
            {router.pathname === "/" && (
              <li className="pb-2 cursor-pointer">
                <LinkRs
                  to="layanan"
                  smooth={true}
                  duration={700}
                  spy={true}
                  activeClass={"text-primary border-b-2 border-primary pb-2"}
                  offset={-70}
                >
                  <span>Layanan</span>
                </LinkRs>
              </li>
            )}
            {session?.user.role === "admin" && (
              <li className="pb-2 cursor-pointer">
                <Link href="/admin/dashboard">
                  <span>Admin Page</span>
                </Link>
              </li>
            )}
          </ul>
          {isAthenticated ? (
            <span
              onClick={() => signOut()}
              className="font-semibold text-primary flex items-center cursor-pointer"
            >
              {session.user.name}
            </span>
          ) : (
            <div onClick={() => signIn()} className="flex items-center">
              <Button
                text={"Sign In"}
                defaultBgColor={"bg-primary"}
                defaultTxtColor={"text-white"}
                borderColor={"border-primary"}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
