"use client";

import { Star } from "lucide-react";

const levelLabels = {
  "1": "Beginner",
  "2": "Intermediate",
  "3": "Proficient",
  "4": "Advanced",
  "5": "Expert"
};

const Skills = ({ resumeInfo }) => {

  
  const renderStars = (rating) => {
  const count = parseInt(rating, 10);
  return (
    <div className="flex gap-0.5 ml-2">
      {[...Array(5)].map((_, i) => (
  <Star 
    key={i}
    size={14}
    className={`${i < count ? "text-yellow-400" : "text-gray-400"}`}
    fill={i < count ? "currentColor" : "none"}
    stroke="currentColor"
  />
))}
    </div>
  );
};


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
        {Array.isArray(resumeInfo?.skills) && resumeInfo?.skills.length > 0 ? (
          resumeInfo.skills.map((skill, index) => (
            <div
              key={index}
              className="text-xs  p-2 rounded-md flex justify-between items-center"
            >
              <span className="font-medium">{skill.name}</span>
              <div className="flex items-center">
                
                <span className="text-[10px] text-gray-500">{levelLabels[skill.level]}</span>
                {renderStars(skill.level)}
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500">No skills listed</p>
        )}
      </div>
    </div>
  );
};

export default Skills;
