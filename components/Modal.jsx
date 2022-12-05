import ReactDOM from "react-dom"
import { MdClose } from "react-icons/md"

const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null

  return ReactDOM.createPortal(
    <>
      <div className="bg-gray-500 opacity-50 fixed top-0 left-0 right-0 bottom-0 z-50" />
      <div className="bg-white min-w-[25rem] rounded-md p-7 fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-5">
          <h1 className="font-bold text-xl">{title}</h1>
          <div onClick={onClose} className="text-red-500 cursor-pointer">
            <MdClose size={25} />
          </div>
        </div>
        <main>{children}</main>
      </div>
    </>,

    document.getElementById("modal-root")
  )
}

export default Modal
