import { redirect } from "next/navigation"
import { getOnBoardingUserStatus } from "../../../../actions/user"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getIndustryInsights } from "../../../../actions/industryInsights"



const Dashboard = async () => {

  const {isOnboarded} = await getOnBoardingUserStatus()
  const {skills}: any = getIndustryInsights()

  if(!isOnboarded){
    redirect('/onboarding')
  }

  return (
    <div className="mt-20 px-24">
      <h1 className="gradient-title animate-gradient text-2xl lg:text-4xl mb-3">Industry Insights</h1>
      <p className="mb-4">last Updated: date</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>{skills}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          
        </Card>
      </div>

    </div>
  )
}

export default Dashboard