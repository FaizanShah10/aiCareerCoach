"use client"

import { useState } from "react"
import { LoaderCircle } from "lucide-react"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { saveSkills } from "../../../../../../actions/resume"
import { toast } from "sonner"

const levelOptions = [
  { label: "Beginner", value: "1" },
  { label: "Intermediate", value: "2" },
  { label: "Proficient", value: "3" },
  { label: "Advanced", value: "4" },
  { label: "Expert", value: "5" },
]

const Skills = () => {
  const [loading, setLoading] = useState(false)
  const [skillsList, setSkillsList] = useState([
    {
      name: "",
      level: "1",
    },
  ])

  const handleChange = (index, name, value) => {
    const newEntries = [...skillsList]
    if (!newEntries[index]) return
    newEntries[index][name] = value
    setSkillsList(newEntries)
  }


  const AddNewSkills = () => {
    setSkillsList((prev) => [...prev, { name: "", level: "1" }])
  }

  const RemoveSkills = () => {
    if(skillsList.length < 0) return
    setSkillsList((prev) => prev.slice(0,-1))
  }

  const onSave = async () => {
    try {
      setLoading(true)
      await saveSkills(skillsList)
      toast.success("Skills Saved Successfully")
      
    } catch (error) {
      toast.error("Something went wrong saving skills, try Again!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add Your top professional key skills</p>

      <div className="space-y-3 mt-4">
        {skillsList.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-end gap-4 border rounded-lg p-3"
          >
            <div className="w-full">
              <label className="text-xs">Name</label>
              <Input
                className="w-full"
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="e.g. React"
              />
            </div>

            <div className="w-40">
              <label className="text-xs">Proficiency</label>
              <Select
                value={item.rating}
                onValueChange={(v) => handleChange(index, "level", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={AddNewSkills}>
            + Add More Skill
          </Button>
          { skillsList.length > 0 && 
            <Button variant="outline" onClick={RemoveSkills}>
              - Remove
            </Button>
          }
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  )
}

export default Skills
