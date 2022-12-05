import "../styles/globals.css"
import Layout from "../components/Layout"
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AdminLayout from "../components/AdminLayout"

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  if (Component.getAuthLayout)
    return Component.getAuthLayout(
      <>
        <Component {...pageProps} />
        <ToastContainer />
      </>
    )

  if (Component.getAdminLayout)
    return Component.getAdminLayout(
      <>
        <SessionProvider session={session}>
          <AdminLayout>
            <Component {...pageProps} />
            <ToastContainer />
          </AdminLayout>
        </SessionProvider>
      </>
    )

  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
        <ToastContainer />
      </Layout>
    </SessionProvider>
  )
}

export default MyApp
