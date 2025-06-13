"use client"

import { PlusSquare } from 'lucide-react'
import React, { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function ResumeBuilder() {
  const [openDialog, setOpenDialog] = useState(false)
  const [resumeTitle, setResumeTitle] = useState("")
  console.log(resumeTitle)

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10'>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <div
            className='p-8 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed border-white'
          >
            <PlusSquare />
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              <p>Add a title for your new resume</p>
              <Input 
              onChange={(e) => setResumeTitle(e.target.value)} 
              className="my-2" 
              placeholder="Ex. Full Stack resume" />
            </DialogDescription>
            <div className='flex justify-end gap-5'>
              <Button onClick={() => setOpenDialog(false)} variant="ghost">Cancel</Button>
              {/* TODO: When Click on Create go to route /resume/resumeId/edit */}
              <Button disabled={!resumeTitle}>Create</Button> 
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* TODO: Show List of Resumes */}
    </div>
  )
}

export default ResumeBuilder
