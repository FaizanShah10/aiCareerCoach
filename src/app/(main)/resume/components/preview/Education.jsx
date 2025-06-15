"use client"


const Education = ({resumeInfo}) => {
  return (
    <div className='my-6'>
    <h2 className='text-center font-bold text-sm mb-2'
    style={{
        color:resumeInfo?.themeColor
    }}
    >Education</h2>
    <hr style={{
        borderColor:resumeInfo?.themeColor
    }} />

    {
        Array.isArray(resumeInfo?.education) && resumeInfo?.education?.length > 0 ? (
            resumeInfo?.education?.map((edu, index) => (
                <div key={index} className='my-5'>
                    <h2 className='text-sm font-bold'
                     style={{
                        color:resumeInfo?.themeColor
                    }}>{edu?.degree}</h2>
                    <h2 className='text-xs flex justify-between'>{edu?.schoolName}, 
                    {edu?.city}, 
                    {edu?.state}
                    <span>{edu?.startDate} To {edu?.currentlyStudying?'Present':edu.endDate} </span>
                    </h2>
                    <div className='text-xs my-2' dangerouslySetInnerHTML={{__html:edu?.description}} />
                </div>
            ))
        ) : (
            <p className='text-xs'>No education information available.</p>
        )
    }

    </div>
  )
}

export default Education