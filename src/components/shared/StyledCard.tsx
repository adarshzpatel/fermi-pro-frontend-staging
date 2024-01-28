import React from 'react'

const StyledCard = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='border ring ring-gray-800/75 rounded-xl overflow-hidden border-gray-600 bg-gray-900 h-full'>{children}</div>
  )
}

export default StyledCard