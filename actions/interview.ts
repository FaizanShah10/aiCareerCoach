"use server"

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

export async function generateQuizQuestions(){
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

            const prompt = `
                    Generate 10 technical interview questions for a ${
                    user.industry
                    } professional${
                    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
                }.
                    
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
                `;

                const result = await model.generateContent(prompt)
                const response = result.response
                const text = response.text()
                const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
                const quiz = JSON.parse(cleanedText)

                return quiz.questions
                          
        } catch (error: any) {
            console.log("Error generating Quiz Questions", error.message)
            throw new Error("Error creating quiz question", error.message)
        }
}

export async function storeQuizQuestions(questions: any, answers: any, score: any){
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
                //formatting question to store in database
                const formattedQuestions = questions.map((q: any, index: any) => ({
                    question: q.question,
                    correctAnswer: q.correctAnswer,
                    userAnswer: q.userAnswer,
                    isCorrect: q.correctAnswer === answers[index],
                    explanation: q.explanation
                }))

                //getting Wrong Answers for ImprovementTips
                const wrongAnswer = formattedQuestions.filter((q: any) => !q.isCorrect)
                
                //formatting wrong Answers
                const formattedWrongAnswers = wrongAnswer.map((q: any) => `Question: ${q.question} \n Correct Answer: "${q.correctAnswer}" \n User Answer: "${q.userAnswer}"` )

                let improvementTip = null
                try {
                    if(wrongAnswer.length > 0){
                            const improvementTipPrompt = `
                            The user got the following ${user.industry} technical interview questions wrong:
    
                            ${formattedWrongAnswers}
    
                            Based on these mistakes, provide a concise, specific improvement tip.
                            Focus on the knowledge gaps revealed by these wrong answers.
                            Keep the response under 2 sentences and make it encouraging.
                            Don't explicitly mention the mistakes, instead focus on what to learn/practice.`
    
                            const tipResult = await model.generateContent(improvementTipPrompt)
                            improvementTip = tipResult.response.text().trim()
                    }
                } catch (error: any) {
                    console.log("Error generating Improvement Tip", error.message)
                }

                //storing the assessment result in db
                try {
                    const assessment = await db.assessment.create({
                        data: {
                            userId: user?.id,
                            quizScore: score,
                            questions: formattedQuestions,
                            category: 'Technical',
                            improvementTip,
                        }
                    })
    
                    return assessment
                } catch (error: any) {
                    console.log("Error storing assessment result", error.message)
                    throw new Error("Error storing assessment result in database")
                }

            } catch (error: any) {
                console.log("Error storing quiz questions in database", error.message)
                throw new Error("Error storing quiz questions in database")
            }

}