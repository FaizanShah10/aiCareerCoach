'use client'

import  { useState } from 'react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { saveEducation } from '../../../../../../actions/resume'
import { Button } from '../../../../../components/ui/button'
import { LoaderCircle, Trash2, Pencil } from 'lucide-react'

const defaultEducation = {
  instituteName: '',
  degree: '',
  programName: '',
  startDate: '',
  endDate: '',
}

const Education = () => {
  const [educationalList, setEducationalList] = useState([])
  const [currentEducation, setCurrentEducation] = useState(defaultEducation)
  const [editingIndex, setEditingIndex] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentEducation((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addOrUpdateEducation = () => {
    if (
      !currentEducation.instituteName ||
      !currentEducation.degree ||
      !currentEducation.programName
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    if (editingIndex !== null) {
      const updated = [...educationalList]
      updated[editingIndex] = currentEducation
      setEducationalList(updated)
      toast.success('Education updated')
    } else {
      setEducationalList([...educationalList, currentEducation])
      toast.success('Education added')
    }

    setCurrentEducation(defaultEducation)
    setEditingIndex(null)
    setShowForm(false)
  }

  const editEducation = (index) => {
    setCurrentEducation(educationalList[index])
    setEditingIndex(index)
    setShowForm(true)
  }

  const removeEducation = (index) => {
    const updated = [...educationalList]
    updated.splice(index, 1)
    setEducationalList(updated)
    toast.success('Education removed')
  }

  const saveAll = async () => {
    try {
      setLoading(true)
      await saveEducation(educationalList)
      toast.success('Education saved successfully!')
      setEducationalList([])
    } catch (error) {
      toast.error('Something went wrong. Try again.')
      console.error('Error Saving Education', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <div className="">
        <h2 className="font-bold text-lg">Education</h2>
        <Button
        className='mt-4'
          variant="outline"
          onClick={() => {
            setCurrentEducation(defaultEducation)
            setEditingIndex(null)
            setShowForm(!showForm)
          }}
        >
          + Add Education
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
          <div className="col-span-2">
            <label>University/College Name</label>
            <Input
              name="instituteName"
              value={currentEducation.instituteName}
              onChange={handleInputChange}
              placeholder="Enter university or college name"
            />
          </div>
          <div>
            <label>Degree</label>
            <Input
              name="degree"
              value={currentEducation.degree}
              onChange={handleInputChange}
              placeholder="e.g., Bachelor's, Master's"
            />
          </div>
          <div>
            <label>Program Name</label>
            <Input
              name="programName"
              value={currentEducation.programName}
              onChange={handleInputChange}
              placeholder="e.g., Computer Science"
            />
          </div>
          <div>
            <label>Start Date</label>
            <Input
              type="date"
              name="startDate"
              value={currentEducation.startDate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>End Date</label>
            <Input
              type="date"
              name="endDate"
              value={currentEducation.endDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={addOrUpdateEducation}>
              {editingIndex !== null ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      )}

      {/* Education List */}
      {educationalList.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-3 border p-3 my-3 rounded-lg relative"
        >
          <div className="col-span-2 font-semibold">
            {item.instituteName} — {item.degree} in {item.programName}
          </div>
          <div>Start: {item.startDate}</div>
          <div>End: {item.endDate}</div>
          <div className="absolute top-3 right-3 flex gap-2">
            <Pencil
              size={18}
              className="cursor-pointer text-blue-600"
              onClick={() => editEducation(index)}
            />
            <Trash2
              size={18}
              className="cursor-pointer text-red-600"
              onClick={() => removeEducation(index)}
            />
          </div>
        </div>
      ))}

      {/* Save All Button */}
      {educationalList.length > 0 && (
        <div className="flex justify-end mt-4">
          <Button disabled={loading} onClick={saveAll}>
            {loading ? <LoaderCircle className="animate-spin" /> : 'Save All'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default Education
