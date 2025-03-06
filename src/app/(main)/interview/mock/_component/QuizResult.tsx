import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Trophy, TrophyIcon } from 'lucide-react'
import React from 'react'

const QuizResult = ({result, startNewQuiz, hideStartNewQuiz = false}: any  ) => {
  if(!result){
    return null
  }


  return (
    <>
        <div className=''>
          {/* Overview Of Quiz Result */}
          <Card >
            <CardContent>
              <div className='flex flex-col gap-2 mt-3'>
                <h2 className='text-2xl font-bold flex items-center'>Quiz Result <span><Trophy className='w-5 h-5'/></span></h2>
                <h2>Score: {result.quizScore.toFixed(1)}%</h2>
                <Progress className='h-[5px]' value={result.quizScore}/>     
              </div>

              {/* Improvement Tip */}
              <div className='px-4 py-2 bg-gray-600 rounded-lg mt-3'>
                <h2 className='font-semibold'>Improvement Tip:</h2>
                <h3 className='text-sm'>{result.improvementTip}</h3>
              </div>


              {/* Wrong Answers and their correct answer with explanation */}
              <div>
                <div>
                  {result.questions.map((q: string, index: number) => (
                    <div key={index}>
                      
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </>
  )
}

export default QuizResult