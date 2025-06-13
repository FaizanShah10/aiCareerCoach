import React, { useContext } from 'react'
import {ResumeInfoContext} from '../../../../context/ResumeInfoContext'

import PersonalInfo from '../components/preview/PersonalInfo'
import Summary from '../components/preview/Summary'
import Experience from '../components/preview/Experience'
import Projects from '../components/preview/Projects'
import Education from '../components/preview/Education'
import Skills from '../components/preview/Skills'

const ResumePreview = () => {

  const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext)


  return (
    <div className='shadow-lg h-full p-14 border-t-[20px]'
    style={{
        borderColor:resumeInfo?.themeColor
    }}>
      {/* Personal Info */}
      <PersonalInfo resumeInfo={resumeInfo}/>
      {/* Summary */}
      <Summary resumeInfo={resumeInfo}/>
      {/* Experience */}
      <Experience resumeInfo={resumeInfo}/>
      {/* Education */}
      <Education resumeInfo={resumeInfo}/>
      {/* Projects */}
      {/* <Projects/> */}
      {/* Skills */}
      <Skills resumeInfo={resumeInfo}/>
    </div>
  )
}

export default ResumePreview