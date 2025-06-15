"use client"

import { Brain, LoaderCircle } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '../../../../../context/ResumeInfoContext'
import {generateImprovedSummary, saveSummary} from '../../../../../../actions/resume'
import { toast } from 'sonner'

const Summary = ({ enabledNext }) => {
  const [loadingSummary, setloadingSummary] = useState(false)
  const [loadingImprovedSummary, setloadingImprovedSummary] = useState(false)
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)

  const handleChange = (e) => {
    setResumeInfo(prev => ({
      ...prev,
      summary: e.target.value
    }))
  }
  

  const onSave = async (e) => {
    e.preventDefault()
    setloadingSummary(true)
    try {
      await saveSummary({summary: resumeInfo.summary})
      setloadingSummary(false)
      enabledNext(true)
      toast.success('Summary saved successfully')
    } catch (error) {
      toast.error('Failed to save summary')
      console.error('Error saving summary:', error)
    }
  }


  const improvedSummary = async () => {
    setloadingImprovedSummary(true)
    try {
      const response = await generateImprovedSummary(resumeInfo.summary)
      setResumeInfo(prev => ({
        ...prev,
        summary: response.summary
      }))
      setloadingImprovedSummary(false)
      toast.success('Summary generated successfully')
      enabledNext(true)
    } catch (error) {
      toast.error('Failed to generate summary')
      console.error('Error generating summary:', error) 
    }
  }

  

  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Summary</h2>
        <p>Add Summary for your job title</p>

        <form className='mt-7' onSubmit={onSave}>
          <div className='flex justify-between items-end'>
            <label>Add Summary</label>
            <Button onClick={improvedSummary} variant="outline"
              type="button" size="sm" className="border-primary text-primary flex gap-2">
              {loadingImprovedSummary ? 
                <p className='flex items-center gap-2'>
                <LoaderCircle className='animate-spin' />
                Generating...
              </p> : 
                <p className='flex items-center gap-2'>
                  <Brain className='w-4 h-4' />
                  Generate Summary
                </p>
              }
            </Button>
          </div>
          <Textarea
          rows={6}
            className="mt-5"
            required
            value={resumeInfo?.summary || ''}
            onChange={handleChange}
          />
          <div className='mt-2 flex justify-end'>
            <Button type="submit" disabled={loadingSummary}>
              {loadingSummary ? <LoaderCircle className='animate-spin' /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Summary
