import Meta from "./Meta"
import Navbar from "./Navbar"

const Layout = ({ children }) => {
  return (
    <>
      <Meta />
      <Navbar />
      <main className="container mx-auto px-20">{children}</main>
    </>
  )
}

export default Layout
