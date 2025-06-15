"use client";


const Skills = ({ resumeInfo }) => {
  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor }}
      >
        Skills
      </h2>
      <hr style={{ borderColor: resumeInfo?.themeColor }} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {
          Array.isArray(resumeInfo?.skills) && resumeInfo?.skills.length > 0 ? (
            resumeInfo?.skills.map((skill, index) => (
              <div
                key={index}
                className="text-xs bg-gray-100 p-2 rounded-md"
              >
                {skill}
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500">No skills listed</p>
          )
        }
      </div>
    </div>
  );
};

export default Skills;
