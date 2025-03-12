"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Save, Plus, PlusCircle, X, Sparkles, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/models/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { z } from "zod";
import useFetch from "../../../../../hooks/useFetch";
import { improveDescription, saveResume } from "../../../../../actions/resume";
import { toast } from "sonner";
import { parse } from "path";
import { format } from "date-fns";

// Define TypeScript types
interface ResumeFormData {
  contactInfo: {
    email: string;
    mobileNumber: string;
    linkedIn?: string;
    githubProfile?: string;
  };
  summary: string;
  skills: string;
  education: { instituteName: string; programName: string; startDate: string; endDate?: string }[];
  workExperience: { title: string; companyName: string; role: string; description: string; startDate: string; endDate?: string; current: boolean }[];
  projects: { projectName: string; projectDescription: string; startDate: string; endDate?: string; liveLink?: string; githubRepo?: string }[];
}

const ResumeBuilder: React.FC<{ initialContent?: Partial<ResumeFormData> }> = ({ initialContent }) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialContent || {
      contactInfo: { email: "", mobileNumber: "", linkedIn: "", githubProfile: "" },
      summary: "",
      skills: "",
      education: [],
      workExperience: [],
      projects: [],
    },
  });

  const { fields: workFields, append: addWork, remove: removeWork } = useFieldArray({ control, name: "workExperience" });
  const { fields: projectFields, append: addProject, remove: removeProjects } = useFieldArray({ control, name: "projects" });
  const { fields: eduFields, append: addEdu, remove: removeEducation } = useFieldArray({ control, name: "education" });

  const [activeTab, setActiveTab] = useState("form")
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

    // Checking if the inital Content of Resume is Present
    useEffect(() => {
      if(initialContent){
        // saveResumeFn(initialContent)
        setActiveTab("view-resume")
      }
    }, [initialContent])


  // useFetch for resume Data
  const {
    data: resumeData,
    error: resumeError,
    loading: resumeLoading,
    fn: saveResumeFn,
  } = useFetch(saveResume)

  // useFetch for improving Data
  const {
    loading: isImproving,
    error: improvementError,
    data: improvementData,
    fn: improvedDescriptionFn
  } = useFetch(improveDescription)

  // use Effect For Checking if the improved Description is present
  useEffect(() => {
    if(improvementData && !isImproving && activeIndex !== null){
      setValue(`workExperience.${activeIndex}.description`, improvementData)
      toast.success("Description Improved")
      setActiveIndex(null);
    }

    if(improvementError){
      toast.error(improvementError || "Error Improving Description")
    }
  }, [improvementData, isImproving, improvementError])

  

  // Handling the addition of work Experience
  const handleAddWork = () => {
    
  }
  

  // Form Submission
  const onSubmit = (data: ResumeFormData) => {
    // Handle form submission
    console.log("form Data: ", data)
    // saveResumeFn(data)
  }

  

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h2 className="gradient-title animate-gradient text-2xl md:text-4xl">Resume Builder</h2>
        <div className="flex gap-3">
          <Button variant="destructive">
            <Save /> Save
          </Button>
          <Button>
            <Download /> Download PDF
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex">
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="view-resume">View Resume</TabsTrigger>
        </TabsList>
        <TabsContent value="form">
          <div className="space-y-6">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Contact Info */}
              <Card className="p-4 space-y-3">
                <h3 className="text-xl font-semibold">Contact Information</h3>
                <Input placeholder="Email" {...register("contactInfo.email")} />
                {errors.contactInfo?.email && (<p className="text-red-500 text-sm">{errors.contactInfo.email.message}</p>)}
                <Input placeholder="Mobile Number" {...register("contactInfo.mobileNumber")} />
                {errors.contactInfo?.mobileNumber && (<p className="text-red-500 text-sm">{errors.contactInfo.mobileNumber.message}</p>)}
                <Input placeholder="LinkedIn Profile" {...register("contactInfo.linkedIn")} />
                {errors.contactInfo?.linkedIn && (<p className="text-red-500 text-sm">{errors.contactInfo.linkedIn.message}</p>)}
                <Input placeholder="GitHub Profile" {...register("contactInfo.githubProfile")} />
                {errors.contactInfo?.githubProfile && (<p className="text-red-500 text-sm">{errors.contactInfo.githubProfile.message}</p>)}
              </Card>

              {/* Summary */}
              <Card className="p-4 space-y-3">
                <h3 className="text-xl font-semibold">Summary</h3>
                <Textarea placeholder="Write a short summary about yourself..." {...register("summary")} />
                {errors.summary && (<p className="text-red-500">{errors.summary.message}</p>)}
              </Card>

              {/* Skills */}
              <Card className="p-4 space-y-3">
              <h3 className="text-xl font-semibold">Skills</h3>
              <Textarea placeholder="List your skills..." {...register("skills")} />
              {errors.skills && (<p className="text-red-500">{errors.skills.message}</p>)}
              </Card>

              {/* Education */}
              <Card className="p-4 space-y-3">
              <h3 className="text-xl font-semibold">Education</h3>
              {eduFields.map((field, index) => (
                <div key={index} className="relative space-y-2 border p-3 rounded">
                  <div className="mb-6">
                  <X 
                    className="absolute top-2 right-2 w-4 h-4 border border-white rounded cursor-pointer"
                    onClick={() => removeEducation(index)}
                  />
                  </div>
                  <Input placeholder="Institute Name" {...register(`education.${index}.instituteName`)} />
                  {errors.education?.[index]?.instituteName && (<p className="text-red-500">{errors.education[index].instituteName.message}</p>)}
                  <Input placeholder="Program Name" {...register(`education.${index}.programName`)} />
                  {errors.education?.[index]?.programName && (<p className="text-red-500">{errors.education[index].programName.message}</p>)}
                  <Input type="date" placeholder="Start Date" {...register(`education.${index}.startDate`)} />
                  {errors.education?.[index]?.startDate && (<p className="text-red-500">{errors.education[index].startDate.message}</p>)}
                  <Input type="date" placeholder="End Date" {...register(`education.${index}.endDate`)} />
                  {errors.education?.[index]?.endDate && (<p className="text-red-500">{errors.education[index].endDate.message}</p>)}
                </div>
              ))}
              <Button onClick={() => addEdu({ instituteName: "", programName: "", startDate: "", endDate: "" })}>
                <PlusCircle /> Add Education
              </Button>
            </Card>

              {/* Work Experience */}
              <Card className="p-4 space-y-3">
              <h3 className="text-xl font-semibold">Work Experience</h3>
              {workFields.map((field, index) => (
                <div key={field.id} className="relative space-y-2 border p-3 rounded">
                  <div className="mb-6">
                  <X 
                    className="absolute top-2 right-2 w-4 h-4 border border-white rounded cursor-pointer"
                    onClick={() => removeWork(index)}
                  />
                  </div>
                  <Input placeholder="Title" {...register(`workExperience.${index}.title`)} />
                  {errors.workExperience?.[index]?.title && (<p className="text-red-500">{errors.workExperience[index].title.message}</p>)}
                  <Input placeholder="Company Name" {...register(`workExperience.${index}.companyName`)} />
                  {errors.workExperience?.[index]?.companyName && (<p className="text-red-500">{errors.workExperience[index].companyName.message}</p>)}
                  <Input placeholder="Role" {...register(`workExperience.${index}.role`)} />
                  <Textarea placeholder="Description" {...register(`workExperience.${index}.description`)} />
                  <Button
                  type="button"
                  size="sm"
                  onClick={(e) => {
                    setActiveIndex(index)
                    improvedDescriptionFn(index)
                  }
                  }
                  >
                  {isImproving && activeIndex === index ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Improving...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Improve with AI
                      </>
                    )}
                  </Button>
                </div>
              ))}
              <Button onClick={() => addWork({ title: "", companyName: "", role: "", description: "", startDate: "", endDate: "", current: false })}>
                  <PlusCircle /> Add Work Experience
                </Button>
            </Card>

              {/* Projects */}
              <Card className="p-4 space-y-3">
                <h3 className="text-xl font-semibold">Projects</h3>
                {projectFields.map((field, index) => (
                  <div key={field.id} className="relative space-y-2 border p-3 rounded">
                    <div className="mb-6">
                  <X 
                    className="absolute top-2 right-2 w-4 h-4 border border-white rounded cursor-pointer"
                    onClick={() => removeProjects(index)}
                  />
                  </div>
                    <Input placeholder="Project Name" {...register(`projects.${index}.projectName`)} />
                    {errors.projects?.[index]?.projectName && (<p className="text-red-500">{errors.projects[index].projectName.message}</p>)}
                    <Textarea placeholder="Project Description" {...register(`projects.${index}.projectDescription`)} />
                    {errors.projects?.[index]?.projectDescription && (<p className="text-red-500">{errors.projects[index].projectDescription.message}</p>)}
                    <Input type="date" {...register(`projects.${index}.startDate`)} />
                    <Input type="date" {...register(`projects.${index}.endDate`)} />
                    <Input placeholder="Live Link" {...register(`projects.${index}.liveLink`)} />
                    <Input placeholder="GitHub Repo" {...register(`projects.${index}.githubRepo`)} />
                  </div>
                ))}
                <Button onClick={() => addProject({ projectName: "", projectDescription: "", startDate: "", endDate: "", liveLink: "", githubRepo: "" })}>
                  <PlusCircle /> Add Project
                </Button>
              </Card>

              {/* Button */}
              <Button type="submit">Submit</Button>
            </form>
          </div>
        </TabsContent>
        <TabsContent value="view-resume">
          <p>Resume Preview (to be implemented)</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
