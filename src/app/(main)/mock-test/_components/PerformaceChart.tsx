"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

/* ======================
   Types
====================== */

type Assessment = {
  createdAt: string | Date;
  quizScore: number;
};

type ChartPoint = {
  date: string;
  score: number;
};

type PerformanceChartProps = {
  assessments: Assessment[];
};

/* ======================
   Component
====================== */

const PerformanceChart = ({ assessments }: PerformanceChartProps) => {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    if (!assessments?.length) return;

    const formattedData: ChartPoint[] = assessments.map((assessment) => ({
      date: format(new Date(assessment.createdAt), "MM-dd"),
      score: assessment.quizScore,
    }));

    setChartData(formattedData);
  }, [assessments]);

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="gradient-title text-2xl">
            Performance Chart
          </CardTitle>
          <CardDescription>Quiz performance over time</CardDescription>
        </CardHeader>

        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} />

              <Tooltip
                content={({
                  active,
                  payload,
                }: TooltipProps<number, string>) => {
                  if (!active || !payload?.length) return null;

                  const point = payload[0].payload as ChartPoint;

                  return (
                    <div className="bg-black text-white shadow-md rounded-md p-2">
                      <p className="text-xs">Score: {point.score}</p>
                      <p className="text-xs">Date: {point.date}</p>
                    </div>
                  );
                }}
              />

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
  );
};

export default PerformanceChart;
