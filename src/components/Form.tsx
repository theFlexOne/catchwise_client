
interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  children: React.ReactNode
  header?: string
}

const Form = ({ onSubmit, children, header }: FormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className='flex flex-col gap-2 items-center min-w-[320px] max-w-[40em]'
    >
      {header && <h1 className='text-3xl font-bold self-start mb-4'>{header}</h1>}
      {children}
    </form>
  )
}

export default Form