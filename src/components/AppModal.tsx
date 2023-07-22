import { useState } from 'react'

type AppModalProps = {
  close: () => void,
  children: React.ReactNode
}

const AppModal = ({ close, children }: AppModalProps) => {

  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      close()
    }
  }


  return (
    <div
      onClick={handleClose}
      className="absolute inset-0 h-full w-full flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity">
      <div className='flex flex-col gap-4 items-center justify-center border rounded bg-white px-12 py-8'>
        {children}
      </div>
    </div>
  )
}

export default AppModal