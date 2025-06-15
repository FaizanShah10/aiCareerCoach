"use client"

import React, { useEffect, useState } from 'react'
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext'
import ResumeForm from '../components/ResumeForm'
import ResumePreview from '../components/ResumePreview'
import { LoaderCircle } from 'lucide-react'
import { getCurrentResume } from '../../../../../actions/resume'
import dummydata from '../../../../data/dummy'

const ResumeEditPage = () => {
  const [resumeInfo, setResumeInfo] = useState(dummydata)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getCurrentResume()
        setResumeInfo(data || dummydata)
        
      } catch (err) {
        console.error("Error fetching resume:", err)
        setResumeInfo(dummydata) 
      } finally {
        setLoading(false)
      }
    }

    fetchResume()
  }, [])

  if (loading || !resumeInfo) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoaderCircle className='animate-spin' size={50} />
      </div>
    )
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className='min-h-[100vh] max-w-[100vw] mt-32 lg:px-24 md:px-18 px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
          <ResumeForm />
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}

export default ResumeEditPage
