import React from 'react';

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
        {resumeInfo?.skills.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">{skill.name}</span>
              <span className="text-xs text-gray-500">{skill.level}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                            backgroundColor:resumeInfo?.themeColor,
                            width: `${skill?.level}%`,
                        }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
