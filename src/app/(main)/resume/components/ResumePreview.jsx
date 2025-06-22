"use client"

import { useContext } from "react"
import { ResumeInfoContext } from "../../../../context/ResumeInfoContext"
import PersonalInfo from "./preview/PersonalInfo"
import Summary from "./preview/Summary"
import Experience from "./preview/Experience"
import Education from "./preview/Education"
import Skills from "./preview/Skills"

const ResumePreview = () => {
  const { resumeInfo } = useContext(ResumeInfoContext)
  

  if (!resumeInfo) return null

  return (
    <div className='shadow-lg h-full p-14 border-t-[20px] text-center'
      style={{ borderColor: resumeInfo?.themeColor }}
    >
      <PersonalInfo resumeInfo={resumeInfo} />
      <Summary resumeInfo={resumeInfo} />
      <Experience resumeInfo={resumeInfo} />
      <Education resumeInfo={resumeInfo} />
      <Skills resumeInfo={resumeInfo} />
    </div>
  )
}

export default ResumePreview
