"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

export const generateAiRoadmap = async (data: string) => {
  const prompt = `

        "Generate a complete and beginner-friendly learning roadmap for ${data}, updated for 2025 year.
            The roadmap should be:
            Easy to follow and well-structured
            Divided into logical sections with icons/emojis and headings
            Include core concepts, tools, best practices, and project ideas at each level (basic, intermediate, advanced)
            Include tips, trends, and recommendations for staying job-ready
            Use bullet points and clear formatting
            Use emojis to make it engaging and readable

            📌 Format:
            Start with a catchy title and tagline: E.g: "Here's an easy and straightforward roadmap to Frontend Development in 2025, designed for both beginners and those looking to solidify their skills:"
            Follow with step-by-step progression (e.g., basics → frameworks → tools → deployment)
            End with project ideas and final tips
            `;

            const result = await model.generateContent(prompt)
            const  response = result.response;
            const text = await response.text();
            const cleanText = text.replace(/```(?:json)?\n?/g, "").trim();
            return cleanText;
};
