import Image from "next/image"
import gambar1 from "../../public/gambar1.svg"
import { HiOutlineArrowNarrowLeft } from "react-icons/hi"
import Link from "next/link"
import { useState } from "react"
import FormInput from "../../components/FormInput"
import Button from "../../components/Button"
import { toast } from "react-toastify"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import Waiting from "../../components/Waiting"

export default function LoginPage() {
  const router = useRouter()
  const [isWaiting, setIsWaiting] = useState(false)

  const [values, setValues] = useState({
    email: "",
    password: "",
  })

  const inputs = [
    {
      id: 1,
      label: "Email",
      type: "email",
      name: "email",
      placeholder: "Masukan email.",
      errorMessage: "Email address tidak valid!",
      required: true,
    },
    {
      id: 2,
      label: "Password",
      type: "password",
      name: "password",
      placeholder: "Masukan password.",
      errorMessage: "Password wajib diisi!",
      required: true,
    },
  ]

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const { email, password } = values

  const onSubmit = async (e) => {
    e.preventDefault()

    setIsWaiting(true)

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (!response.ok) return toast.error(response.error)

      router.push(router.query.callbackUrl)
    } catch (error) {
      console.log(error)
    } finally {
      setIsWaiting(false)
    }
  }

  return (
    <div
      className="h-screen flex justify-center items-center"
      style={{
        backgroundImage: "url(/loginbg.jpg)",
        backgroundSize: "contain",
      }}
    >
      <div className="bg-white h-[90vh] w-[65vw] rounded-md opacity-90">
        <div className="flex h-full">
          <div className="h-full w-[50vw] p-12">
            <Link href="/">
              <div className="inline-flex items-center gap-x-3 hover:text-primary duration-200">
                <HiOutlineArrowNarrowLeft size={25} />
                <span className="font-semibold">Back</span>
              </div>
            </Link>
            <div className="flex flex-col gap-y-10 justify-center items-center h-full">
              <h1 className="text-center font-bold text-2xl">
                Platform Khusus Organisasi BEM Unidksha
              </h1>
              <Image
                src={gambar1}
                width={400}
                alt={"voting-image"}
                priority={true}
              />
            </div>
          </div>
          <div className="h-full w-full p-12">
            <div className="mb-10">
              <h1 className="font-bold text-2xl">Welcome to Evonsy</h1>
              <p className="text-gray-500">
                Electonic Voting and Open Recruitment System
              </p>
            </div>
            <form onSubmit={onSubmit}>
              <h1 className="text-center font-semibold text-xl mb-3">
                Sign In
              </h1>
              {inputs.map((input) => (
                <FormInput
                  key={input.id}
                  {...input}
                  value={values[input.name]}
                  onChange={onChange}
                />
              ))}
              {isWaiting ? (
                <div className="flex justify-center">
                  <Waiting />
                </div>
              ) : (
                <div className="mt-7">
                  <Button
                    text={"Login"}
                    defaultTxtColor={"text-primary"}
                    borderColor={"border-primary"}
                    hoverColor={"bg-primary"}
                  />
                </div>
              )}
            </form>
            <p className="text-end mt-3">Lupa password?</p>
          </div>
        </div>
      </div>
    </div>
  )
}

LoginPage.getAuthLayout = function getAuthLayout(page) {
  return <>{page}</>
}
