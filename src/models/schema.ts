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
const contactInfoSchema = z.object({
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().min(10, "Invalid mobile number").max(15, "Invalid mobile number"),
  linkedIn: z.string().url("Invalid URL").optional(),
  githubProfile: z.string().url("Invalid URL").optional(),
});

// Work Experience Schema
const workExperienceSchema = z.array(
  z.object({
    title: z.string().min(1, "Title is required"),
    companyName: z.string().min(1, "Company name is required"),
    role: z.string().min(1, "Role is required"),
    description: z.string().min(1, "Description is required"),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().default(false)
  })
);

// Project Schema
const projectSchema = z.array(
  z.object({
    projectName: z.string().min(1, "Project name is required"),
    projectDescription: z.string().min(1, "Project description is required"),
    startDate: z.string(),
    endDate: z.string().optional(),
    liveLink: z.string().url("Invalid URL").optional(),
    githubRepo: z.string().url("Invalid URL").optional(),
  })
);

const educationSchema = z.array(
  z.object({
    instituteName: z.string().min(1, "Institute name is required"),
    programName: z.string().min(1, "Program Name is required"),
    startDate: z.string(),
    endDate: z.string().optional(),
  })
);

// Resume Schema combining all
export const resumeSchema = z.object({
  contactInfo: contactInfoSchema,
  summary: z.string().min(10, "Summary must be at least 10 characters long").max(1000, "Summary too long"),
  skills: z.string().min(1, "At least one skill is required"),
  workExperience: workExperienceSchema,
  projects: projectSchema,
  education: educationSchema
});
