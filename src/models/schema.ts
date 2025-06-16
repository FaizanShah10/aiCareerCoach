import { title } from 'process';
import {string, z} from 'zod'

export const onBoardingSchema = z.object({
    industry: z.string({
        required_error: "Please enter an industry"
    }),
    subIndustry: z.string({
        required_error: "Please enter a sub-industry"
    }),
    bio: z.string().max(500).optional(),
    experience: 
    z.string()
    .transform((val) => parseInt(val, 10))
    .pipe(
        z.number()
        .min(0, "Experience must be greater than 0 years")
        .max(50, "Experience must not exceeds 50 years")   
    ),
    skills: 
    z
    .string()
    .transform((val) => 
        val 
            ?
                val
                .split(',')
                .map((skill) => skill.trim())
                .filter(Boolean)

                : undefined
            )
})

// Contact Information Schema
// const contactInfoSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   mobileNumber: z.string().min(10, "Invalid mobile number").max(15, "Invalid mobile number"),
//   linkedIn: z.string().url("Invalid URL").optional(),
//   githubProfile: z.string().url("Invalid URL").optional(),
// });


// Personal Info Schema
const personalInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("Invalid email address"),
  phoneNo: z.string().min(10, "Invalid phone number").max(15, "Invalid phone number"), 
  address: z.string(),
  jobTitle: z.string().min(5),
  websiteUrl: z.string().url("Invalid URL").optional(),
});

// Summary Schema
export const summarySchema = z.object({
  resumeId: z.string().min(1, "Resume ID is required"),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(1000, "Summary must not exceed 1000 characters"),
})

// Education Schema
export const educationSchema = z.object({
  resumeId: z.string().min(1, "Resume ID is required"),
  instituteName: z.string().min(1, "Institute name is required"),
  programName: z.string().min(1, "Program name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
})

// Skills Schema
export const skillsSchema = z.object({
  resumeId: z.string().min(1, "Resume ID is required"),
  skills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "At least one skill is required"),
})

// if skills is seperated by comma
// export const rawSkillsSchema = z.object({
//   resumeId: z.string(),
//   skills: z
//     .string()
//     .transform((val) =>
//       val
//         .split(',')
//         .map((s) => s.trim())
//         .filter(Boolean)
//     )
// })

// Project Schema
export const projectSchema = z.object({
  resumeId: z.string().min(1, "Resume ID is required"),
  projectName: z.string().min(1, "Project name is required"),
  projectDescription: z.string().min(1, "Project description is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  liveLink: z
    .string()
    .url("Live link must be a valid URL")
    .optional()
    .or(z.literal("")), // allows empty string if frontend sends it
  githubRepo: z
    .string()
    .url("GitHub repo must be a valid URL")
    .optional()
    .or(z.literal("")),
})


// Work Experience Schema
export const workExperienceSchema = z.object({
  resumeId: z.string().min(1, "Resume ID is required"),
  title: z.string().min(1, "Job title is required"),
  companyName: z.string().min(1, "Company name is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  workSummary: z.string().min(1, "workExperience is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  current: z.boolean().optional().default(false),
})


// Resume Schema combining all
export const resumeSchema = z.object({
  contactInfo: personalInfoSchema,
  summary: z.string().min(10, "Summary must be at least 10 characters long").max(1000, "Summary too long"),
  skills: z.string().min(1, "At least one skill is required"),
  workExperience: workExperienceSchema,
  projects: projectSchema,
  education: educationSchema
});
