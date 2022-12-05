const Button = ({
  text,
  defaultBgColor,
  defaultTxtColor,
  borderColor,
  hoverColor,
}) => {
  return (
    <button
      className={`${defaultBgColor} w-full relative inline-flex items-center justify-center p-4 px-6 py-2.5 overflow-hidden font-medium shadow-md transition duration-300 ease-out border ${borderColor} rounded-lg group`}
    >
      <span
        className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full ${hoverColor} group-hover:translate-x-0 ease`}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          ></path>
        </svg>
      </span>
      <span
        className={`${defaultTxtColor} absolute flex items-center justify-center w-full h-full transition-all duration-300 transform group-hover:translate-x-full ease`}
      >
        {text}
      </span>
      <span className="relative invisible">{text}</span>
    </button>
  )
}

export default Button
