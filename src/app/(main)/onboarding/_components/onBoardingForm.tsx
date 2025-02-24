"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"



import { onBoardingSchema } from "@/models/schema"

import { useForm, SubmitHandler } from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import useFetch from "../../../../../hooks/useFetch"
import { updateUser } from "../../../../../actions/user"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"


const onBoardingForm = ({industries}: any) => {

  const {
    loading: updateLoading,
    data: updatedResult,
    fn: updateUserFn
  } 
  = useFetch(updateUser)

  const [selectedIndustry, setSelectedIndustry] = useState<{
    id: string;
    name: string;
    subIndustries: string[];
  } | null>(null);

  const {register, handleSubmit, setValue, watch, reset, formState: {errors, isLoading}} = useForm({
    resolver: zodResolver(onBoardingSchema)
  })

  //watch for industry selection
  const watchIndustry = watch('industry')


  const onsubmit = async (values: any) => {
      console.log(values)

      // Values --> industry & subindutry => formattedindustry
      const formattedIndustry = `${values.industry}-${values.subIndustry.toLowerCase().replace(/ /g, "-")}`

      try {
        await updateUserFn({
          formattedIndustry,
          ...values
        })
      } catch (error: any) {
          toast.error(error.message)
      }

      reset()
  }
  
  const router = useRouter()

  //side functions
  useEffect(() => {
    if(updatedResult?.success && !updateLoading){
      toast.success("Profile Successfully Completed")
      router.push('/dashboard')
      router.refresh()
    }
  },[updateLoading, updatedResult])

  return (
    <div>
      <div className="flex items-center justify-center mt-20">
      <Card className="w-full max-w-lg ">
        <CardHeader>
          <CardTitle className="lg:text-4xl font-bold gradient-title animate-gradient text-center">Complete your profile</CardTitle>
          <CardDescription className="text-center">Complete your profile for tailored career insights and recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onsubmit)} className="space-y-2">
              {/* Industry */}
              <div className="space-y-3">
                <Label htmlFor="industry" className="text-left">Industry</Label>
                <Select
                onValueChange={(value) => {
                  setValue('industry', value)
                  setSelectedIndustry(
                    industries.find((industry: any) => industry.id === value)
                  )
                }}
                >
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select industry"/>
                  </SelectTrigger>
                  <SelectContent>
                    {
                      industries.map((industry: any) => (
                        <SelectItem key={industry.id} value={industry.id}>
                          {industry.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              {/* Sub Industry */}
              {
                watchIndustry && (
                  <div className="space-y-2">
                  <Label htmlFor="subIndustry" className="text-left">Specialization</Label>
                  <Select
                    onValueChange={(value) => {
                      setValue('subIndustry', value)
                    }}
                  >
                    <SelectTrigger id="subIndustry">
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Specializations</SelectLabel>
                        {selectedIndustry?.subIndustries.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                )
              }

              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-left">Experience</Label>
                <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter Year of Experience"
                {...register("experience")}
                />
                {
                  errors.experience && (
                    <p className="text-sm text-red-500">{errors.experience.message}</p>
                  )
                }
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label htmlFor="skills" className="text-left">Skills</Label>
                <Input
                id="skills"
                type="text"
                placeholder="Enter your skilss e.g Javascipt, Python etc"
                {...register("skills")}
                />
                {
                  errors.skills && (
                    <p className="text-sm text-red-500">{errors.skills.message}</p>
                  )
                }
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-left">Bio</Label>
                <Textarea
                id="bio"
                placeholder="Enter your bio"
                className="h-32 bg-black p-4 rounded-lg w-full text-sm"
                {...register("bio")}
                />
                {
                  errors.bio && (
                    <p className="text-sm text-red-500">{errors.bio.message}</p>
                  )
                }
              </div>

              {/* Button */}
              <Button type="submit" className="w-full" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
              
              

          </form>
        </CardContent>
        
      </Card>
      </div>
    </div>
  )
}

export default onBoardingForm