
import { Button } from '../../../../components/ui/button'
import Link from 'next/link'
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext'

const ViewResume = ({resumeInfo}) => {

  // console.log("Resume Info from ViewResume last page:", resumeInfo)

  return (
    <ResumeInfoContext.Provider value={{resumeInfo}}>
        <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
       <div className='flex flex-col items-center mt-12 gap-4'>
         <h2>Your resume data has been saved. You're now ready to preview it.</h2>
        <div>
            <Link href={`/resume/${resumeInfo.id}/view`}>
                <Button>
                    View Resume
                </Button>
            </Link>
        </div>
       </div>
    </div>
    </ResumeInfoContext.Provider>
  )
}

export default ViewResume