import Image from "next/image";
import Banner1 from "../../../public/Banner1.webp";
import { Button } from "../ui/button";


export default function Home() {
  return (
    <div className="relative w-full h-screen">
      <Image
        src={Banner1}
        alt="AI Career Coach"
        objectFit="cover"        
      />

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-3xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title animate-gradient">Your AI Coach for <br /> Career Excellence</h1>
        <p className="text-sm md:text-xl mt-4">Unlock your full potential with AI-driven career insights.</p>
        <div className="mt-6 flex space-x-4">
           
          <Button className="bg-white rounded-full px-7 py-5 font-medium text-black hover:bg-white text-sm">Get Started</Button>
          <Button className="bg-black rounded-full px-7 py-5 font-medium text-white hover:bg-black text-sm border border-gray-300">
                Watch demo
           </Button>
        </div>
      </div>
    </div>
  );
}
