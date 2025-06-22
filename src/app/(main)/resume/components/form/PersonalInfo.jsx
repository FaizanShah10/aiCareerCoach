"use client"

import React, { useContext, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react'
import { ResumeInfoContext } from '../../../../../context/ResumeInfoContext'
import { savePersonalInfo } from '../../../../../../actions/resume'
import { toast } from 'sonner'



const PersonalInfo = ({enabledNext}) => {


  const [loading, setLoading] = useState(false)
  const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext)


  const handleInputChange = (e) => {
      enabledNext(false)
      const {name, value} = e.target

      setResumeInfo({
        ...resumeInfo,
        [name]:value
      })
      
  }

  const onSave = async (e) => {
  e.preventDefault()
  setLoading(true)
  try {
    await savePersonalInfo(resumeInfo)
    toast.success("Resume saved successfully")
    enabledNext(true)
  } catch (error) {
    console.error(error)
    toast.error("Failed to save resume")
  } finally {
    setLoading(false)
  }

}


  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4'>
        <h2 className='font-bold text-lg'>Personal Detail</h2>
        <p>Get Started with the basic information</p>

        {/* Form */}
        <form onSubmit={onSave}>
            <div className='grid grid-cols-2 mt-5 gap-3'>
                <div>
                    <label className='text-sm'>First Name</label>
                    <Input
                    name="firstName"
                    value={resumeInfo.firstName || ''}
                    placeholder='Enter your first name'
                    onChange={handleInputChange}
                    required
                    />
                </div>
                <div>
                    <label className='text-sm'>Last Name</label>
                    <Input name="lastName" required  
                    value={resumeInfo?.lastName || ''}
                    placeholder={resumeInfo?.lastName} 
                                        onChange={handleInputChange}/>
                </div>
                <div className='col-span-2'>
                    <label className='text-sm'>Job Title</label>
                    <Input name="jobTitle" required 
                    value={resumeInfo?.jobTitle || ''}
                    placeholder={resumeInfo?.jobTitle}
                    onChange={handleInputChange} />
                </div>
                <div className='col-span-2'>
                    <label className='text-sm'>Address</label>
                    <Input name="address" required 
                    value={resumeInfo?.address || ''}
                    placeholder={resumeInfo?.address}
                                        onChange={handleInputChange} />
                </div>
                <div>
                    <label className='text-sm'>Phone</label>
                    <Input name="phoneNo" required 
                    value={resumeInfo?.phoneNo || ''}
                    placeholder={resumeInfo?.phone}
                                        onChange={handleInputChange} />
                </div>
                <div>
                    <label className='text-sm'>Email</label>
                    <Input name="email" required 
                    value={resumeInfo?.email || ''}
                    placeholder={resumeInfo?.email}
                                       onChange={handleInputChange}/>
                </div>

                <div className='col-span-2'>
                    <label className='text-sm'>Website Url</label>
                    <Input name="websiteUrl" required 
                    value={resumeInfo?.websiteUrl || ''}
                    placeholder="Optional"
                    onChange={handleInputChange} />
                </div>
            </div>

            <div className='mt-3 flex justify-end'>
                <Button type="submit"
                disabled={loading}>
                    {loading?<LoaderCircle className='animate-spin' />:'Save'}
                </Button>
            </div>
        </form>
    </div>
  )
}

export default PersonalInfo