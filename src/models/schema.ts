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