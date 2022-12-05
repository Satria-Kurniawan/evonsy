import Head from "next/head"

const Meta = ({ title, keywords, description }) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <title>{title}</title>
    </Head>
  )
}

Meta.defaultProps = {
  title: "Evonsy",
  keywords: "electronic voting, open recruitment, bem, bem ftk, undiksha",
  description:
    "Evonsy adalah platform khusus untuk pemilihan anggota kepengurusan BEM FTK Undiksha",
}

export default Meta
