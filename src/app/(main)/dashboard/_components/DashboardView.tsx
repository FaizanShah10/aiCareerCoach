"use client"


import { Brain, Briefcase, LineChart, TrendingDown, TrendingUp } from "lucide-react";
import {format, formatDistanceToNow} from 'date-fns'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const DashboardView = ({insights}: any) => {


    const getSalaryRanges = () => {
        const salryRanges = insights.salaryRanges.map((range: any) => {
            name: range.role;
            min: range.min / 1000;
            max: range.max;
            median: range.median / 1000
        })
    }

    const getDemandLevelColor = (level: any) => {
        switch (level.toLowerCase()) {
            case 'high':
                return 'bg-green-500'
            case 'medium':
                return 'bg-yellow-500'
            case 'low':
                return 'bg-red-500'
            default:
                return 'bg-gray-500'
        }
    }

    
      

    const getMarketOutLook = (marketOutLook: any) => {
        switch (marketOutLook.toLowerCase()) {
            case 'positive':
                return {icon: TrendingUp, color: 'text-green-500'}
            case 'neutral':
                return {icon: LineChart, color: 'text-yellow-500'}
            case 'negative':
                return {icon: TrendingDown, color: 'text-red-500'}
            default:
                return {icon: LineChart, color: 'text-gray-500'}
        }
    }

    const { icon: MarketTrendIcon, color: marketTrendColor } = getMarketOutLook(insights.marketOutlook);

    const lastUpdatedDate = format(new Date(insights.lastUpdated), 'dd-MM-yyyy')
    const TimeToNextUpdate = formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true })

  return (
    <div className="mt-20 px-24">
        <div>
            <h1 className="gradient-title animate-gradient text-2xl lg:text-4xl mb-3">Industry Insights</h1>
            <p className="mb-4">last Updated: {lastUpdatedDate}</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
            <CardHeader>
                <div className="flex justify-between">
                    <CardTitle className="text-sm">Market Outlook</CardTitle>
                    <span className={marketTrendColor}>
                    <MarketTrendIcon className="w-5 h-5" />
                    </span>
                </div>
                <CardDescription className="text-2xl font-bold">{insights.marketOutlook}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-xs">Next Update: {TimeToNextUpdate}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <div className="flex justify-between">
                    <CardTitle className="text-sm">Industry Growth</CardTitle>
                    <span className={marketTrendColor}>
                    <MarketTrendIcon className="w-5 h-5" />
                    </span>
                </div>
                <CardDescription className="text-2xl font-bold">{insights.growthRate}%</CardDescription>
            </CardHeader>
            <CardContent>
            <Progress value={insights.growthRate} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <div className="flex justify-between">
                    <CardTitle className="text-sm">Demand Level</CardTitle>
                    <Briefcase className="w-4 h-4" />
                </div>
                <CardDescription className="text-2xl font-bold">{insights.demandLevel}</CardDescription>
            </CardHeader>
            <CardContent>
                <Progress value={100} className={`h-2 ${getDemandLevelColor(insights.demandLevel)}`}/>
            </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.map((skill: any) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardView