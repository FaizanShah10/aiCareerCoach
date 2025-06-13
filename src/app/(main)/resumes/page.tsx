import { getResume } from "../../../../actions/resume"
import ResumeBuilder from "./_components/ResumeBuilder"

const ResumePage = async () => {

  const resume = await getResume()

  return (
    <div className="mt-32 lg:px-24 md:px-18 px-4 min-h-screen">
      <h2 className="text-3xl text-white font-bold">Resume Section</h2>
      <p>Start creating your resume for job role</p>
      <div>
        <ResumeBuilder/>
      </div>
    </div>
  )
}

export default ResumePage