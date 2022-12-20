import Image from "next/image"
import herosection1 from "../public/herosection1.jpg"
import herosection2 from "../public/herosection2.jpg"
import hero1 from "../public/hero1.jpg"
import hero2 from "../public/hero2.jpg"
import layanan1 from "../public/l1.svg"
import layanan2 from "../public/l2.svg"
import layanan3 from "../public/l3.svg"
import particle from "../public/particle.png"
import Button from "../components/Button"
import Rellax from "rellax"
import { useEffect } from "react"
import Link from "next/link"

export default function Home() {
  useEffect(() => {
    new Rellax(".rellax-herro1", {
      speed: 3,
      vertical: true,
    })

    new Rellax(".rellax-herro2", {
      speed: 5,
      vertical: true,
    })

    new Rellax(".rellax-layanan1", {
      speed: 2,
      vertical: true,
    })

    new Rellax(".rellax-layanan2", {
      speed: 1,
      vertical: true,
    })

    new Rellax(".rellax-layanan3", {
      speed: 0.5,
      vertical: true,
    })

    new Rellax(".rellax", {
      speed: -3,
      vertical: true,
    })
  }, [])

  const layanans = [
    {
      title: "Open Recruitment System",
      description:
        "Mahasiswa dapat melakukan pendaftaran anggota kepengurusan secara online dengan mudah",
      image: layanan1,
      alt: "layanan 1",
      path: "/openrecruitment",
    },
    {
      title: "Electronic Voting System",
      description:
        "Menyediakan layanan voting anggota kepengurusan berbasis online",
      image: layanan2,
      alt: "layanan 2",
      path: "/votings",
    },
    {
      title: "Organization Management System",
      description:
        "Anggota Organisasi dapat melakukan pengelolaan kegiatan, seperti laporan kegiatan, program kerja, dan yang lainnya",
      image: layanan3,
      alt: "layanan 3",
      path: "/",
    },
  ]

  return (
    <>
      <section id="beranda">
        <Image
          src={particle}
          alt={"."}
          priority={true}
          className="absolute right-0 rellax opacity-30 z-10"
        />
        <Image
          src={herosection1}
          alt={"herosection1"}
          className="h-screen w-full absolute top-0 left-0 right-0 bottom-0"
        />
        <Image
          src={herosection2}
          alt={"herosection2"}
          className="h-screen w-full absolute top-0 left-0 right-0 bottom-0 opacity-90"
          priority="true"
        />
        <Image
          src={hero1}
          alt={"hero"}
          width={250}
          height={250}
          className="absolute top-44 right-28  w-auto h-auto rounded-md overflow-hidden z-20 rellax-herro1"
        />
        <Image
          src={hero2}
          alt={"hero2"}
          width={250}
          height={250}
          className="absolute bottom-16 right-80  w-auto h-auto rounded-md overflow-hidden z-10 rellax-herro2"
        />
        <div className="relative top-28 min-h-screen z-10">
          <h1 className="font-bold text-5xl max-w-2xl mb-5">
            Electronic Voting & Open Recruitment System BEM FTK UNDIKSHA
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mb-5">
            Evonsy adalah platform khusus untuk memfasilitasi organisasi Badan
            Eksekutif Mahasiswa Universitas Pendidikan Ganesha
          </p>
          <div className="max-w-[10rem]">
            <Link href={"/openrecruitment"}>
              <Button
                text={"Join"}
                defaultBgColor={"bg-primary"}
                defaultTxtColor={"text-white"}
                borderColor={"border-primary"}
              />
            </Link>
          </div>
        </div>
      </section>
      <section id="layanan">
        <div className="mb-20">
          <h1 className="text-center font-bold text-2xl mb-3">Layanan</h1>
          <p className="text-gray-500 max-w-xs mx-auto mb-3">
            System ini memiliki beberapa layanan yang berguna untuk
            memfasilitasi aktivitas organisasi kampus
          </p>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto" />
        </div>
        <div className="grid grid-cols-3 gap-x-3">
          {layanans.map((layanan, i) => (
            <div
              key={i}
              className={`z-20 p-5 ${
                i === 0
                  ? "rellax-layanan1"
                  : i === 1
                  ? "rellax-layanan2"
                  : "rellax-layanan3"
              }`}
            >
              <Image
                src={layanan.image}
                alt={layanan.alt}
                width={i === 0 ? 240 : 300}
                height={i === 0 ? 240 : 300}
                className="w-auto h-auto"
              />
              <h1 className="font-bold text-lg mb-1">{layanan.title}</h1>
              <p className="text-gray-500 mb-3">{layanan.description}</p>
              <Link href={layanan.path} className="z-20">
                <div className="max-w-[8rem]">
                  <Button
                    text={"Lihat"}
                    defaultTxtColor={"text-primary"}
                    borderColor={"border-primary"}
                    hoverColor={"bg-primary"}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
