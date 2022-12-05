import Image from "next/image"
import { useEffect, useState } from "react"
import { MdHowToVote } from "react-icons/md"
import Modal from "../../components/Modal"
import Button from "../../components/Button"
import { useRouter } from "next/router"

export default function VotingCandidatesPage() {
  const router = useRouter()
  const [candidatesForVotings, setCandidatesForVotings] = useState([])
  const [isWaiting, setIsWaiting] = useState(false)

  useEffect(() => {
    setIsWaiting(true)
    fetch("/api/votings")
      .then((response) => {
        if (response.ok) return response.json()
        console.log(response)
      })
      .then((data) => setCandidatesForVotings(data.candidatesForVotings))
      .finally(() => setIsWaiting(false))
  }, [])

  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState({})

  const onSelected = (candidate, number) => {
    setIsOpen(true)
    setSelected(candidate)
    setSelected((prev) => ({ ...prev, no: number }))
  }

  const skeletons = []

  for (let i = 0; i < 3; i++) {
    skeletons.push(i)
  }

  return (
    <>
      <div className="my-10">
        <div className="max-w-xs mx-auto text-center font-bold text-2xl mb-3">
          <span>Voting Calon Ketua dan </span>
          <span>Wakil BEM FTK </span>
          <span className="text-primary">Undiksha</span>
        </div>
        <div className="w-16 mx-auto border-b-4 border-primary rounded-full"></div>

        <section className="mt-20">
          <div className="mx-auto grid grid-cols-3 gap-x-5 max-w-[52rem]">
            {isWaiting
              ? skeletons.map((obj, i) => (
                  <div>
                    <div className="rounded-md w-full h-64 mb-3 skeleton"></div>
                    <div className="flex items-center gap-x-5">
                      <div className="rounded-full w-10 h-10 skeleton"></div>
                      <div className="w-[80%]">
                        <div className="rounded-md w-full h-3 skeleton mb-3"></div>
                        <div className="rounded-md w-[90%] h-3 skeleton"></div>
                      </div>
                    </div>
                  </div>
                ))
              : candidatesForVotings.map((obj, i) => (
                  <>
                    <div>
                      <div className="relative rounded-md group">
                        <Image
                          src={`/thumbnails/${obj.thumbnail}`}
                          alt={"thumbnail"}
                          width={400}
                          height={600}
                          className="rounded-md group-hover:brightness-75 duration-300"
                        />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="hidden group-hover:block">
                            <button
                              onClick={() => onSelected(obj, i + 1)}
                              className="rounded-md py-3 px-5 bg-primary font-semibold text-white flex items-center gap-x-2"
                            >
                              Vote
                              <MdHowToVote size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="font-semibold text-lg mt-3 flex items-center gap-x-5">
                        <div className="rounded-full bg-primary text-white w-10 h-10 flex justify-center items-center">
                          {i + 1}
                        </div>
                        <div>
                          <h1>{obj.ketua}</h1>
                          <h1>{obj.wakil}</h1>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
          </div>
        </section>

        <Modal
          title={`Vote Kandidat No. ${selected.no}`}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="flex gap-x-5">
            <Image
              src={`/thumbnails/${selected.thumbnail}`}
              alt={"thumbnail"}
              width={200}
              height={200}
              className="rounded-full w-16 h-16"
            />
            <div className="font-semibold text-lg w-full">
              <h1>{selected.ketua}</h1>
              <h1>{selected.wakil}</h1>
              <div className="rounded-md border p-3 font-normal text-sm text-gray-500 mb-5">
                <h1 className="text-primary">Visi</h1>
                <p>{selected.visi}</p>
                <h1 className="text-primary">Misi</h1>
                <p>{selected.misi}</p>
              </div>
              <div className="flex gap-x-3">
                <div onClick={() => setIsOpen(false)} className="w-full">
                  <Button
                    text={"Cancel"}
                    borderColor={"border-red-500"}
                    defaultTxtColor={"text-red-500"}
                    hoverColor={"bg-red-500"}
                  />
                </div>
                <div
                  onClick={() => router.push("/votings/livecount")}
                  className="w-full"
                >
                  <Button
                    text={"Vote"}
                    borderColor={"border-primary"}
                    defaultTxtColor={"text-primary"}
                    hoverColor={"bg-primary"}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}
