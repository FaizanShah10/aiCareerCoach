import Image from "next/image";
import Banner1 from "../../../public/Banner1.webp";


export default function Home() {
  return (
    <div className="relative w-full h-screen">
      <Image
        src={Banner1}
        alt="AI Career Coach"
        objectFit="cover"
        fill        
      />

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-3xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title animate-gradient">Your AI Coach for <br /> Career Excellence</h1>
        <p className="text-sm md:text-xl mt-4">Unlock your full potential with AI-driven career insights.</p>
        <div className="mt-6 flex space-x-4">
           

        </div>
      </div>
    </div>
  );
}
