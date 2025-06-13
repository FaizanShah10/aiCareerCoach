"use client"

import React, { useContext, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react'
import { ResumeInfoContext } from '../../../../../context/ResumeInfoContext'



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

  const onSave = (e) => {
      e.preventDefault()
  }

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4'>
        <h2 className='font-bold text-lg'>Personal Detail</h2>
        <p>Get Started with the basic information</p>

        {/* Form */}
        <form>
            <div className='grid grid-cols-2 mt-5 gap-3'>
                <div>
                    <label className='text-sm'>First Name</label>
                    <Input name="firstName" placeHolder={resumeInfo?.firstName} required onChange={handleInputChange}/>
                </div>
                <div>
                    <label className='text-sm'>Last Name</label>
                    <Input name="lastName" required  
                    placeHolder={resumeInfo?.lastName} onChange={handleInputChange}/>
                </div>
                <div className='col-span-2'>
                    <label className='text-sm'>Job Title</label>
                    <Input name="jobTitle" required 
                    placeHolder={resumeInfo?.jobTitle}
                     onChange={handleInputChange} />
                </div>
                <div className='col-span-2'>
                    <label className='text-sm'>Address</label>
                    <Input name="address" required 
                    placeHolder={resumeInfo?.address}
                     onChange={handleInputChange} />
                </div>
                <div>
                    <label className='text-sm'>Phone</label>
                    <Input name="phone" required 
                    placeHolder={resumeInfo?.phone}
                     onChange={handleInputChange} />
                </div>
                <div>
                    <label className='text-sm'>Email</label>
                    <Input name="email" required 
                    placeHolder={resumeInfo?.email}
                      onChange={handleInputChange}/>
                </div>

                <div className='col-span-2'>
                    <label className='text-sm'>Website Url</label>
                    <Input name="websiteUrl" required 
                    placeHolder="Optional"
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