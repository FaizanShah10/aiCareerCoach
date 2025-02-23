import { redirect } from "next/navigation"
import { getOnBoardingUserStatus } from "../../../../actions/user"



const Dashboard = async () => {

  const {isOnboarded} = await getOnBoardingUserStatus()

  if(!isOnboarded){
    redirect('/onboarding')
  }

  return (
    <div>Dashboard Page</div>
  )
}

export default Dashboard