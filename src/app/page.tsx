import HeroSection from '@/components/HeroSection/Hero'
import FeatureSection from '@/components/Features/page'
import {AccordianSection} from '@/components/Accordian'
import CtaSection from '@/components/CtaSection'
import Testimonial from '@/components/Testimonials'

export default function Home(){
  return (
    <div> 
      <HeroSection/>
      <FeatureSection/>
      <Testimonial/>
      <AccordianSection/>
      <CtaSection/>
      
    </div>
  )
}