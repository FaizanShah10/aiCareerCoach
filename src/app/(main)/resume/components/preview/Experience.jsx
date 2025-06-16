"use client";

const Experience = ({resumeInfo}) => {
    
  return (
    <div className='my-6'>
        <h2 className='text-center font-bold text-sm mb-2'
        style={{
            color:resumeInfo?.themeColor
        }}
        >Professional Experience</h2>
        <hr style={{
            borderColor:resumeInfo?.themeColor
        }} />

        {resumeInfo?.work?.map((experience,index)=>(
            <div key={index} className='my-5'>
                <h2 className='text-sm font-bold text-left'
                 style={{
                    color:resumeInfo?.themeColor
                }}>{experience?.title}</h2>
                <h2 className='text-xs flex justify-between'>{experience?.companyName}, 
                {experience?.city}, 
                {experience?.state}
                <span>{experience?.startDate} To {experience?.current ?'Present':experience.endDate} </span>
                </h2>
                <p className='text-xs my-2 text-left'>
                    {experience.workSummary}
                </p>
                {/* <div className='text-xs my-2' dangerouslySetInnerHTML={{__html:experience?.workSummery}} /> */}
            </div>
        ))}
    </div>
  )
}

export default Experience