import React from 'react'

const summary = ({resumeInfo}) => {
  return (
    <div>
      <p className='text-xs'>
        {resumeInfo?.summery}
      </p>
    </div>
  )
}

export default summary