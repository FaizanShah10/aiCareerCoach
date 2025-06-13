"use client"

import React, { useEffect, useState } from 'react'
import ResumePreview from '../../components/ResumePreview'
import ResumeForm from '../../components/ResumeForm'
import {ResumeInfoContext} from '../../../../../context/ResumeInfoContext'
import dummydata from '../../../../../data/dummy'

const ResumeEditPage = () => {

  const [resumeInfo, setResumeInfo] = useState()

  useEffect(() => {
    setResumeInfo(dummydata)
  }, [])

  // console.log(resumeInfo)

  return (
      <ResumeInfoContext.Provider value={{resumeInfo, setResumeInfo}}>
        <div className='min-h-[100vh] max-w-[100vw] mt-32 lg:px-24 md:px-18 px-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/* Form Section */}
            <ResumeForm/>
            
            {/* Preview Section */}
            <ResumePreview/>
            
          </div>
        </div>
      </ResumeInfoContext.Provider>
  )
}

export default ResumeEditPage