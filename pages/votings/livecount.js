import { useEffect, useState } from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Pie } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function LiveCountPage() {
  const [candidatesForVotings, setCandidatesForVotings] = useState([])

  useEffect(() => {
    fetch("/api/votings")
      .then((response) => {
        if (response.ok) return response.json()
        console.log(response)
      })
      .then((data) => setCandidatesForVotings(data.candidatesForVotings))
  }, [])

  console.log(candidatesForVotings.map((obj) => obj.currentVotes))

  return (
    <div className="my-10">
      <div className="max-w-xs mx-auto text-center font-bold text-2xl mb-3">
        <span>Live Count Akumulasi Perolehan Suara </span>
        <span className="text-primary">Kandidat</span>
      </div>
      <div className="w-16 mx-auto border-b-4 border-primary rounded-full"></div>
      <section className="mt-20">
        <div className="mx-auto w-80">
          <Pie
            data={{
              labels: candidatesForVotings.map(
                (obj) => `${obj.ketua} & ${obj.wakil}`
              ),
              datasets: [
                {
                  label: "Total Votes",
                  data: candidatesForVotings.map((obj) => obj.currentVotes),
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>
      </section>
    </div>
  )
}
