import { redirect } from "next/navigation"
import { getOnBoardingUserStatus } from "../../../../actions/user"

import { getIndustryInsights } from "../../../../actions/industryInsights"
import DashboardView from "./_components/DashboardView"



const Dashboard = async () => {

  const {isOnboarded} = await getOnBoardingUserStatus()
  const insights = await getIndustryInsights()

  if(!isOnboarded){
    redirect('/onboarding')
  }

  return (
    <div>
      <DashboardView insights={insights}/>
      
      

    </div>
  )
}

export default Dashboard