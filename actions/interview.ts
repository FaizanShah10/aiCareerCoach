"use server"

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { err } from "inngest/types";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

export async function generateQuizQuestions(topic: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({ where: { clerkUserId: userId } })
    if (!user) throw new Error("User Not Found")

    const prompt = `
      Generate 10 technical interview questions focusing on the topic: "${topic}".

      Each question should be multiple choice with 4 options.
      
      Return the response in this JSON format only, no additional text:
      {
        "questions": [
          {
            "question": "string",
            "options": ["string", "string", "string", "string"],
            "correctAnswer": "string",
            "explanation": "string"
          }
        ]
      }
    `

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim()
    const quiz = JSON.parse(cleanedText)

    return quiz.questions
  } catch (error: any) {
    console.log("Error generating Quiz Questions", error.message)
    throw new Error("Error creating quiz question")
  }
}

export async function storeQuizQuestions(
  questions: any,
  answers: any,
  score: number
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({ where: { clerkUserId: userId } })
  if (!user) throw new Error("User Not Found")

  try {
    // format question results
    const formattedQuestions = questions.map((q: any, index: number) => ({
      question: q.question,
      correctAnswer: q.correctAnswer,
      userAnswer: answers[index],
      isCorrect: q.correctAnswer === answers[index],
      explanation: q.explanation,
    }))

    // wrong answers for improvement tips
    const wrongAnswer = formattedQuestions.filter((q: any) => !q.isCorrect)
    const formattedWrongAnswers = wrongAnswer.map(
      (q: any) =>
        `Question: ${q.question}\nCorrect Answer: "${q.correctAnswer}"\nUser Answer: "${q.userAnswer}"`
    )

    let improvementTip = null
    try {
      if (wrongAnswer.length > 0) {
        const improvementTipPrompt = `
          The user got the following ${user.industry} technical interview questions wrong:

          ${formattedWrongAnswers}

          Based on these mistakes, provide a concise, specific improvement tip.
          Focus on the knowledge gaps revealed by these wrong answers.
          Keep the response under 2 sentences and make it encouraging.
        `

        const tipResult = await model.generateContent(improvementTipPrompt)
        improvementTip = tipResult.response.text().trim()
      }
    } catch (error: any) {
      console.log("Error generating Improvement Tip", error.message)
    }

    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: formattedQuestions,
        category: "Technical",
        improvementTip,
      },
    })

    return assessment
  } catch (error: any) {
    console.log("Error storing quiz questions in database", error.message)
    throw new Error("Error storing quiz questions in database")
  }
}

// For Fetching the Assessments
export async function getAssessment(){
    try {
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

            const response = await db.assessment.findMany({
                where: {
                    userId: user.id
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            return response

            // console.log(response)
    } catch (error: any) {
        console.log("Error Fetching the Assessments", error.message)
    }
}