export const dynamic = "force-dynamic";

import OnBoardingForm from '@/app/(main)/onboarding/_components/onBoardingForm'
import {industries} from '@/data/industries'
import { getOnBoardingUserStatus } from '../../../../actions/user'
import { redirect } from 'next/navigation'


const onBoardingPage = async () => {

  const {isOnboarded} = await getOnBoardingUserStatus()   

  if(isOnboarded){
    return redirect('/dashboard')
  }

  return (
    <div>
      <OnBoardingForm industries={industries}/>
    </div>
  )
}

export default onBoardingPage