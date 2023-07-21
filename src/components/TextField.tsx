import { useMemo } from "react"

interface TextFieldProps {
  id?: string
  label: string
  name: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}


const TextField = ({ id, label, name, type = "text", placeholder, value, onChange }: TextFieldProps) => {
  const memoizedId = useMemo(() => id ?? crypto.getRandomValues(new Uint32Array(1))[0].toString(16), [id])

  return (
    <div className="flex flex-col gap-2 bg-zinc-500/40 rounded p-4 w-full">
      <label
        htmlFor={memoizedId}
        className='text-sm font-semibold'
      >
        {label}
      </label>
      <input
        className="bg-transparent focus:outline-none"
        type={type}
        name={name}
        id={memoizedId}
        placeholder={placeholder ?? label}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default TextField