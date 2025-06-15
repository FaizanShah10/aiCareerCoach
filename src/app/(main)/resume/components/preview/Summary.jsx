"use client"


const Summary = ({resumeInfo}) => {
  return (
    <div>
      <h2 className=' font-bold text-sm mb-2'
        style={{
            color:resumeInfo?.themeColor
        }}
        >Summary</h2>
        
      <p className='text-xs m-2 text-left'>
        {resumeInfo?.summary}
      </p>
      <hr style={{
            borderColor:resumeInfo?.themeColor
        }} />
    </div>
  )
}

export default Summary