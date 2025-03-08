  "use client"

  import { format } from "date-fns"
  import { useEffect, useState } from "react"

  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
  } from 'recharts';

  const PerformanceChart = ({ assessments }: any) => {
    const [chartData, setChartData] = useState<any[]>([])

    useEffect(() => {
      if (assessments?.length > 0) {
        const formattedData = assessments.map((assessment: any) => ({
          date: format(new Date(assessment.createdAt), "MM-dd"),
          score: assessment.quizScore
        }))
        setChartData(formattedData)
      }
    }, [assessments])

    return (
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="gradient-title text-2xl">Performance Chart</CardTitle>
            <CardDescription>Quiz Performance over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" interval={"preserveStartEnd"}/>
                <YAxis domain={[0, 100]}/>
                <Tooltip content={({active, payload}) => {
                  if (active && payload?.length){
                    return (
                      <div className="bg-black text-white shadow-md rounded-md p-2">
                        <p className="text-xs">Score: {payload[0].value}</p>
                        <p className="text-xs ">Date: {payload[0].payload.date}</p>
                      </div>
                    )
                  }
                }} />
                <Line 
                type="monotone" 
                dataKey="score" 
                stroke="white" 
                strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  export default PerformanceChart
