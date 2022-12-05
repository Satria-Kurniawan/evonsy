import { useState } from "react"

const FormInput = ({ label, onChange, errorMessage, ...inputProps }) => {
  const [focused, setFocused] = useState(false)

  return (
    <div className="mb-3">
      <label>{label}</label>
      <br />
      <input
        {...inputProps}
        onChange={onChange}
        className="border rounded-md py-3 px-5 w-full focus:outline-primary drop-shadow-sm"
        onBlur={(e) => setFocused(true)}
        focused={focused.toString()}
      />
      <span className="hidden text-sm text-red-500">{errorMessage}</span>
    </div>
  )
}

export default FormInput
