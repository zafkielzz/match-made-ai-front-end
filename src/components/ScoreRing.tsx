import React from "react";

interface ScoreRingProps {
  score: number;
}

const getColor = (score: number) => {
  if (score >= 80) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  return "text-red-500";
};

const ScoreRing: React.FC<ScoreRingProps> = ({ score }) => (
  <div className="flex flex-col items-center">
    <svg width="48" height="48" viewBox="0 0 36 36">
      <path
        className="text-gray-200"
        strokeWidth="4"
        fill="none"
        stroke="currentColor"
        d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32z"
      />
      <path
        className={getColor(score)}
        strokeWidth="4"
        fill="none"
        stroke="currentColor"
        strokeDasharray={`${score}, 100`}
        d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32z"
      />
    </svg>
    <span className="font-bold mt-1">{score}%</span>
  </div>
);

export default ScoreRing;
