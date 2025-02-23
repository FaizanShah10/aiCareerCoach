import OnBoardingForm from '@/app/(main)/onboarding/_components/onBoardingForm'
import {industries} from '@/data/industries'


const onBoardingPage = () => {
  return (
    <div>
      <OnBoardingForm industries={industries}/>
    </div>
  )
}

export default onBoardingPage