"use client";

import { useContext, useState } from "react";
import { ResumeInfoContext } from "../../../../context/ResumeInfoContext";
import PersonalInfo from "./preview/PersonalInfo";
import Summary from "./preview/Summary";
import Experience from "./preview/Experience";
import Education from "./preview/Education";
import Skills from "./preview/Skills";

// const themeColors = [
//   "fffffff",
//   "#3B82F6", // Blue
//   "#10B981", // Green
//   "#EF4444", // Red
//   "#F59E0B", // Amber
//   "#8B5CF6", // Violet
// ];

const ResumePreview = () => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const handleThemeChange = (color) => {
    setResumeInfo({ ...resumeInfo, themeColor: color });
  };

  if (!resumeInfo) return null;

  return (
    <div className="flex flex-col items-center">
      {/* Theme Color Buttons */}
      {/* <div className="flex gap-2 mb-4">
        {themeColors.map((color) => (
          <button
            key={color}
            className="w-6 h-6 rounded-full border-2"
            style={{
              backgroundColor: color,
              borderColor: resumeInfo.themeColor === color ? "black" : "transparent",
            }}
            onClick={() => handleThemeChange(color)}
          />
        ))}
      </div> */}

      {/* Resume Content */}
      <div
        className="shadow-lg h-full px-10 py-8 border-t-[20px] text-center w-full max-w-4xl"
        style={{ borderColor: resumeInfo?.themeColor }}
      >
        <PersonalInfo resumeInfo={resumeInfo} />
        <Summary resumeInfo={resumeInfo} />
        <Experience resumeInfo={resumeInfo} />
        <Education resumeInfo={resumeInfo} />
        <Skills resumeInfo={resumeInfo} />
      </div>
    </div>
  );
};

export default ResumePreview;
