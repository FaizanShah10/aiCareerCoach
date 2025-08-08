"use client"

import { useContext, useEffect, useRef, useState } from 'react'
import ResumePreview from '../../components/ResumePreview'
import { getCurrentResume } from '../../../../../../actions/resume'
import { ResumeInfoContext } from '../../../../../context/ResumeInfoContext'
import html2pdf from 'html2pdf.js'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const ViewResume = () => {
  const [resumeInfo, setResumeInfo] = useState(null)
  const resumeRef = useRef()
  const [laoding, setLaoding] = useState(false)

  useEffect(() => {
    const fetchResume = async () => {
      const res = await getCurrentResume()
      setResumeInfo(res)
    }
    fetchResume()
  }, [])

  const handleDownloadPDF = () => {
    setLaoding(true)
    const element = resumeRef.current
    const opt = {
      margin: 0,
      filename: `resume-${resumeInfo?.firstName || 'user'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    html2pdf().set(opt).from(element).save()
    setLaoding(false)
  }

  if (!resumeInfo) return <p className='text-center mt-20'>Loading resume...</p>

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo }}>
      <div className='w-full h-full'>
        <div className="flex justify-center mt-20 my-4">
          <Button onClick={handleDownloadPDF}>{laoding ? <Loader2 className="animate-spin"/> : "Download PDF"}</Button>
        </div>
        <div ref={resumeRef} className="bg-white text-black p-4 max-w-[800px] mx-auto shadow-md">
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}

export default ViewResume
