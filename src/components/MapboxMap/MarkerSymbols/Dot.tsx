import { twMerge } from "tailwind-merge"

const Dot = ({ colorPrimary = '#00B1FD', colorSecondary = 'white' }: Dot) => {
  return (
    <div>
      <svg width={"1rem"} height={"1rem"} viewBox="0 0 578 578" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="289" cy="289" r="205.429" fill={colorSecondary} stroke="black" strokeWidth="2" />
        <circle cx="289" cy="289" r="185.536" fill={colorPrimary} stroke="black" strokeWidth="0.5" />
      </svg>
    </div>

  )
}

type Dot = {
  colorPrimary?: string
  colorSecondary?: string
}


export default Dot