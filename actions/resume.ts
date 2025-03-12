"use server"


import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import {GoogleGenerativeAI} from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

//save (update or create) resume
export async function saveResume(content: any){

    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });

    if (!user) {
        throw new Error("User Not Found");
    }

    try {
        const resume = await db.resume.upsert({
            where: {
                userId: user.id
            },
            create: {
                userId: user.id,
                content
            },
            update: {
                content
            }
        })

        return resume
    } catch (error: any) {
        console.log("Error Creating/saving Resume", error.message)
        throw new Error("Something went wrong in creating/saving resume")
    }
}


// get resume
export async function getResume(){
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });

    if (!user) {
        throw new Error("User Not Found");
    }

    try {
        const resume = db.resume.findMany({
            where: {
                userId: user.id
            }    
        })

        return resume
    } catch (error: any) {
        console.log("Error getting Resume", error.message)
        throw new Error("Something went wrong in getting Resume")
        
    }
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

    console.log("Entered Description: ", description)

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
