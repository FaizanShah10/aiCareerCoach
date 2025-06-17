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
                <div key={index} className='my-5 text-left'>
                    <h2 className='text-sm font-bold'
                     style={{
                        color:resumeInfo?.themeColor
                    }}>{edu?.degree}</h2>
                    <span className="font-semibold">{edu.degree} in {edu.programName}</span>  
                    <h2 className='text-xs flex justify-between'>{edu?.instituteName}, 
                    <span>{edu?.startDate} To {edu?.currentlyStudying?'Present':edu.endDate} </span>
                    </h2>
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