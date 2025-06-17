"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'

import PersonalInfo from './form/PersonalInfo'
import Summary from './form/Summary'
import Experience from './form/Experience'
import Education from './form/Education'
import Skills from './form/Skills'


const ResumeForm = () => {

  const [activeFormIndex, setActiveFormIndex] = useState(1)
  const [enableNext, setEnableNext] = useState(true)


  return (
    <div>
        <div className='flex justify-between items-center mb-3'>
          <div className='flex gap-5'>
            <Link href={"/dashboard"}>
          <Button><Home/></Button>
          </Link>
          {/* <ThemeColor/> */}
         
          </div>
          <div className='flex gap-2'>
            {activeFormIndex>1
            &&<Button size="sm" 
            onClick={()=>setActiveFormIndex(activeFormIndex-1)}> <ArrowLeft/> </Button> }
            <Button 
            disabled={!enableNext}
            className="flex gap-2" size="sm"
            onClick={()=>setActiveFormIndex(activeFormIndex+1)}
            > Next 
            <ArrowRight/> </Button>
          </div>
        </div>
      {activeFormIndex==1 ? <PersonalInfo enabledNext={(value) => setEnableNext(value)}/> : null}
      {activeFormIndex==2 ? <Summary enabledNext={(value) => setEnableNext(value)}/> : null}
      {activeFormIndex==3 ? <Experience enabledNext={(value) => setEnableNext(value)}/> : null}
      {activeFormIndex==4 ? <Education enabledNext={(value) => setEnableNext(value)}/> : null}
      {activeFormIndex==5 ? <Skills enabledNext={(value) => setEnableNext(value)}/> : null}
    </div>
  )
}

export default ResumeForm