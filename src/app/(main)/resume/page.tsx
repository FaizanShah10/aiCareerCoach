import { getResume } from "../../../../actions/resume"
import ResumeBuilder from "./_components/ResumeBuilder"

const ResumePage = async () => {

  const resume = await getResume()

  return (
    <div className="mt-20 lg:px-24 md:px-18 px-4 min-h-screen">
      <ResumeBuilder initialContent={resume[0]?.content}/>
    </div>
  )
}

export default ResumePage