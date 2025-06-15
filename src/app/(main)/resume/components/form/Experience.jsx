import React, { useEffect, useState } from 'react'
import {Input} from '../../../../../components/ui/input'
import {Button} from '../../../../../components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"

const formFields = {
    title:'',
    companyName:'',
    city:'',
    state:'',
    startDate:'',
    endDate:'',
    description:'',
}

const Experience = () => {

  const [experinceList, setExperinceList] = useState([formFields])
  const [loading, setLoading] = useState(false)

  const handleChange = (index, event) => {
      const {name, value} = event.target
      const experienceList = experinceList.slice()
      experienceList[index][name] = value
      setExperinceList(experienceList)
  }

  const AddNewExperience = () => {
      setExperinceList([...experinceList, formFields])
  }

  const RemoveExperience = () => {
    setExperinceList(experinceList.slice(0, -1))
  }

  useEffect(() => {
    console.log(experinceList)
  }, [experinceList])

  return (
    <div>
      Experience
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Professional Experience</h2>
        <p>Add Your previous Job experience</p>
        <div>
            {experinceList.map((item,index)=>(
                <div key={index}>
                    <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
                        <div>
                            <label className='text-xs'>Position Title</label>
                            <Input name="title" 
                            onChange={(event)=>handleChange(index,event)}
                            defaultValue={item?.title}
                            />
                        </div>
                        <div>
                            <label className='text-xs'>Company Name</label>
                            <Input name="companyName" 
                            onChange={(event)=>handleChange(index,event)}
                            defaultValue={item?.companyName} />
                        </div>
                        <div>
                            <label className='text-xs'>City</label>
                            <Input name="city" 
                            onChange={(event)=>handleChange(index,event)} 
                            defaultValue={item?.city}/>
                        </div>
                        <div>
                            <label className='text-xs'>State</label>
                            <Input name="state" 
                            onChange={(event)=>handleChange(index,event)}
                            defaultValue={item?.state}
                             />
                        </div>
                        <div>
                            <label className='text-xs'>Start Date</label>
                            <Input type="date"  
                            name="startDate" 
                            onChange={(event)=>handleChange(index,event)} 
                            defaultValue={item?.startDate}/>
                        </div>
                        <div>
                            <label className='text-xs'>End Date</label>
                            <Input type="date" name="endDate" 
                            onChange={(event)=>handleChange(index,event)} 
                            defaultValue={item?.endDate}
                            />
                        </div>
                        <div className='col-span-2'>
                           {/* Work Summary  */}
                           <Textarea 
                           rows={4}
                           onChange={(event)=>handleChange(index,event)}
                           defaultValue={item?.description}
                           name="description"
                           placeholder="Describe your work summary" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className='flex justify-between'>
            <div className='flex gap-2'>
            <Button variant="outline" onClick={AddNewExperience} className="text-primary"> + Add More Experience</Button>
            <Button variant="outline" onClick={RemoveExperience} className="text-primary"> - Remove</Button>

            </div>
            <Button disabled={loading} onClick={()=>onSave()}>
            {loading?<LoaderCircle className='animate-spin' />:'Save'}    
            </Button>
        </div>
        </div>  
    </div>
  )
}

export default Experience