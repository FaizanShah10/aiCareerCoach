"use client";

import {
  Brain,
  Briefcase,
  LineChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

/* =======================
   Types
======================= */

type SalaryRange = {
  role: string;
  min: number;
  max: number;
  median: number;
  location: string;
};

type MarketOutlook = "positive" | "neutral" | "negative";
type DemandLevel = "high" | "medium" | "low";

type IndustryInsights = {
  marketOutlook: MarketOutlook;
  growthRate: number;
  demandLevel: DemandLevel;
  topSkills: string[];
  salaryRanges: SalaryRange[];
  keyTrends: string[];
  recommendedSkills: string[];
  lastUpdated: string | Date;
  nextUpdate: string | Date;
};

type DashboardViewProps = {
  insights: IndustryInsights;
};

/* =======================
   Component
======================= */

const DashboardView = ({ insights }: DashboardViewProps) => {
  const salaryData = insights.salaryRanges.map((data) => ({
    role: data.role,
    min: data.min,
    max: data.max,
    average: data.median,
    location: data.location,
  }));

  const getDemandLevelColor = (level: DemandLevel): string => {
    switch (level) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlook = (outlook: MarketOutlook) => {
    switch (outlook) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const { icon: MarketTrendIcon, color: marketTrendColor } =
    getMarketOutlook(insights.marketOutlook);

  const lastUpdatedDate = format(
    new Date(insights.lastUpdated),
    "dd-MM-yyyy"
  );

  const timeToNextUpdate = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="mt-20 lg:px-24 md:px-18 px-4 min-h-screen">
      <div>
        <h1 className="gradient-title animate-gradient text-2xl lg:text-4xl mb-3">
          Industry Insights
        </h1>
        <p className="mb-4">Last Updated: {lastUpdatedDate}</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Market Outlook */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-sm">Market Outlook</CardTitle>
              <span className={marketTrendColor}>
                <MarketTrendIcon className="w-5 h-5" />
              </span>
            </div>
            <CardDescription className="text-2xl font-bold">
              {insights.marketOutlook}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs">Next Update: {timeToNextUpdate}</p>
          </CardContent>
        </Card>

        {/* Industry Growth */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-sm">Industry Growth</CardTitle>
              <span className={marketTrendColor}>
                <MarketTrendIcon className="w-5 h-5" />
              </span>
            </div>
            <CardDescription className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={insights.growthRate} />
          </CardContent>
        </Card>

        {/* Demand Level */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle className="text-sm">Demand Level</CardTitle>
              <Briefcase className="w-4 h-4" />
            </div>
            <CardDescription className="text-2xl font-bold">
              {insights.demandLevel}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`h-2 w-full rounded-full ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1">
            {insights.topSkills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Salary Chart */}
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Salary Ranges by Role</CardTitle>
            <CardDescription>
              Min, Max and Median Salaries (in thousands)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" />
                  <YAxis />
                  <Tooltip
                    content={({
                      active,
                      payload,
                    }: TooltipProps<number, string>) => {
                      if (!active || !payload?.length) return null;

                      const data = payload[0].payload as {
                        role: string;
                        location: string;
                      };

                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{data.role}</p>
                          <p className="text-xs text-muted-foreground">
                            {data.location}
                          </p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                  <Bar dataKey="average" fill="#64748b" name="Median Salary (K)" />
                  <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends & Skills */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
            <CardDescription>
              Trends Driving Market Evolution
            </CardDescription>
          </CardHeader>
          <CardContent>
            {insights.keyTrends.map((trend) => (
              <Badge key={trend} className="mb-2 mr-2">
                {trend}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
            <CardDescription>Skills to focus on</CardDescription>
          </CardHeader>
          <CardContent>
            {insights.recommendedSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="mb-2 mr-2">
                {skill}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
