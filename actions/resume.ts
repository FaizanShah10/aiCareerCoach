"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

type PersonalInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  address: string;
  jobTitle: string;
  websiteUrl?: string;
};

type Summary = {
  summary: string;
};

type WorkExperience = {
  title: string,
  companyName: string,
  city: string,
  state: string,
  startDate: string,
  endDate: string,
  workSummary: string,
  current: boolean,
}

type Education = {
  instituteName:string,
  degree: string,
  programName:string,
  startDate:string,
  endDate:string
}

type Skills = {
  name: string,
  level: string
}

// Save PersonalInfoData
export async function savePersonalInfo(formData: PersonalInfo) {
  const { userId: clerkUserId } = await auth();

  // Find the actual user record in your DB
  if (!clerkUserId) {
    throw new Error("User not authenticated");
  }
  const user = await db.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  const { firstName, lastName, email, phoneNo, address, jobTitle, websiteUrl } =
    formData;

  try {
    const existingResume = await db.resume.findUnique({
      where: { userId: user.id },
    });

    if (existingResume) {
      // Update only personal info fields
      await db.resume.update({
        where: { userId: user.id },
        data: {
          firstName,
          lastName,
          email,
          phoneNo,
          address,
          jobTitle,
          websiteUrl,
        },
      });
    } else {
      // Create a new resume with personal info
      await db.resume.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          email,
          phoneNo,
          address,
          jobTitle,
          websiteUrl,
          content: "",
        },
      });
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to save personal info:", err);
    throw new Error("Failed to save personal info");
  }
}

// save Summary
export async function saveSummary(formData: Summary) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const resume = await db.resume.findFirst({
    where: { userId: user.id },
  });

  if (!resume) throw new Error("No resume found for this user");

  try {
    await db.resume.update({
      where: { id: resume.id },
      data: {
        summary: formData.summary,
        content: resume.content ? resume.content : "",
      },
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to save summary:", err);
    throw new Error("Failed to save summary");
  }
}

// generate improved summary by AI
export async function generateImprovedSummary(summary: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  const resume = await db.resume.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!resume) throw new Error("No resume found for this user");

  if (!resume.summary) throw new Error("No summary found for this resume");

  const prompt = `
        You are a highly skilled professional resume strategist with deep expertise in crafting compelling, results-driven career summaries tailored to modern industry standards.

        Your task is to take the provided summary and **elevate it into a powerful, polished, and professional statement** that reflects **clarity, confidence, and measurable impact**.

        ### ✦ Guidelines:
        - Transform the input into a **concise and impactful one-sentence summary, Make Sure the summary is upto 6-7 lines**.
        - Use **powerful action verbs**, **specific achievements**, and **industry-relevant language**.
        - Ensure the tone reflects **expertise, initiative, and value** to employers.
        - Maintain the **original intent and meaning**, but present it in a more **compelling, executive-level** style.
        - Avoid vague terms or filler content—every word should add value.

        ### ✦ Example Input:
        "I am a mern stack developer with experience in building web applications."

        ### ✦ Example Output:
        Motivated and dedicated Full Stack Web Developer with 1+ years of experience building responsive, scalable, and visually
        appealing web applications. Successfully made 2 full stack projects and multiple frontend websites, including interactive
        dashboards and e-commerce platforms, leveraging technologies like React.js, Node.js, and MongoDB. Skilled in implementing secure backend systems, role-based access control, and seamless user experiences, including Stripe payment
        integration. Passionate about problem-solving and collaborating with teams to deliver impactful solutions.

        ---

        Now, rewrite the following summary to reflect this standard:

        "${summary}"

        ---

        ✦ **Return only the enhanced summary as plain text.**
        ✦ **Do NOT include any formatting, explanation, or additional characters.**
        `;

        try {
          const result = await model.generateContent(prompt);
          const response = result.response;
          const enhancedSummary = response.text();

          return { summary: enhancedSummary };
        } catch (error) {
          console.error("Error generating improved summary:", error);
          throw new Error("Failed to generate improved summary");
        }

        
}

// Save Work Experience
export async function saveWorkExperience( workExperience: WorkExperience[]){
  const {userId} = await auth();
  if(!userId) throw new Error("UnAuthorized")

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    }
  })

  if(!user) throw new Error("User not found");

  const resume = await db.resume.findFirst({
    where: { userId: user.id },
  });

  if (!resume) throw new Error("No resume found for this user");

  try {
    await db.workExperience.createMany({
      data: workExperience.map((experience) => ({
        resumeId: resume.id,
        title: experience.title,
        companyName: experience.companyName,
        startDate: experience.startDate,
        endDate: experience.endDate,
        city: experience.city,
        state: experience.state,
        workSummary: experience.workSummary,
        current: experience.current,
      }))
    })
  } catch (error) {
    console.error("Failed to save work experience:", error);
    throw new Error("Failed to save work experience");
  }

}

// save Education
export async function saveEducation(education: Education[]){
    try {
      const {userId} = await auth();
      if(!userId) throw new Error("UnAuthorized")

      const user = await db.user.findUnique({
        where: {
          clerkUserId: userId,
        }
      })

      if(!user) throw new Error("User not found");

      const resume = await db.resume.findFirst({
        where: { userId: user.id },
      });

      if (!resume) throw new Error("No resume found for this user");

      await db.education.createMany({
        data: education.map((education) => ({
          resumeId: resume.id,
          instituteName: education.instituteName,
          degree: education.degree,
          programName: education.programName,
          startDate: education.startDate,
          endDate: education.endDate,
        }))
      })
    } catch (error: any) {
      console.log("Error Creating Education", error.message)
      throw new Error("Error Creating Education")
    }
}

// save Skills
export async function saveSkills(skills: Skills[]){
  try {
    const {userId} = await auth();
      if(!userId) throw new Error("UnAuthorized")

      const user = await db.user.findUnique({
        where: {
          clerkUserId: userId,
        }
      })

      if(!user) throw new Error("User not found");

      const resume = await db.resume.findFirst({
        where: { userId: user.id },
      });

      if (!resume) throw new Error("No resume found for this user");

      await db.skill.createMany({
        data: skills.map((skill) => ({
          resumeId: resume.id,
          name: skill.name,
          level: skill.level
        }))
      })
  } catch (error: any) {
    console.log("Error Creating Skills", error.message)
    throw new Error("Error Creating Skills")
  }
}


// get Current Resume
export async function getCurrentResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const resume = await db.resume.findFirst({
    where: { userId: user.id },
    include: {
      education: true,
      work: true,
      projects: true,
      skills: true
      }
  });

  if (!resume) throw new Error("No resume found for this user");

  return resume;
}

//improving the description with AI
export async function improveDescription(description: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  console.log("Entered Description: ", description);

  const prompt = `
        You are an expert resume writer. Take the given job description and enhance it to be more **impactful, professional, and industry-standard**.
        Keep the meaning **aligned with the original input** but improve it using **better language, strong action verbs, and measurable impact**.

        ### **Example Input:**
        "I worked as a front-end developer."

        ### **Example Output:**
        "Designed and developed responsive web applications as a Frontend Developer, leveraging React.js and modern UI/UX principles to enhance user engagement."

        **Now improve the following description:**
        "${description}"

        - **Keep the output as a single, enhanced sentence**  
        - **Do NOT include any JSON, markdown, or extra formatting**  
        - **Return only the improved description as plain text**  
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improveDescription = response.text();

    // Ensure it's a clean string with no unexpected formatting
    return improveDescription.trim();
  } catch (error: any) {
    console.log("Error Improving Description", error.message);
    throw new Error("Something went wrong in improving the description");
  }
}
