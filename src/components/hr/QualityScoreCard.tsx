import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { calculateQualityScore, QualityScoreResult } from "@/utils/qualityScore";

interface QualityScoreCardProps {
  formData: any;
}

export const QualityScoreCard: React.FC<QualityScoreCardProps> = ({ formData }) => {
  const result: QualityScoreResult = calculateQualityScore(formData);
  
  const getScoreColor = (score: number): string => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-blue-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };
  
  const getScoreBgColor = (score: number): string => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <Card className="border-white/10 bg-gradient-to-br from-primary/5 to-purple-500/5 backdrop-blur-sm sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          Quality Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="text-center">
          <div className={`text-5xl font-bold ${getScoreColor(result.totalScore)}`}>
            {result.totalScore}
          </div>
          <p className="text-sm text-slate-400 mt-1">out of 100</p>
          <Progress 
            value={result.totalScore} 
            className="mt-3 h-2"
          />
        </div>
        
        {/* Overall Suggestions */}
        <div className="bg-black/30 rounded-lg p-3 border border-white/10">
          <p className="text-sm text-slate-300">
            {result.overallSuggestions[0]}
          </p>
        </div>
        
        {/* Breakdown */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Breakdown
          </p>
          {result.breakdown.map((item, index) => {
            const percentage = (item.score / item.maxScore) * 100;
            const hasIssues = item.suggestions.length > 0;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {hasIssues ? (
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    )}
                    <span className="text-sm text-white">{item.category}</span>
                  </div>
                  <span className="text-sm text-slate-400">
                    {item.score}/{item.maxScore}
                  </span>
                </div>
                
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${getScoreBgColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                {item.suggestions.length > 0 && (
                  <ul className="space-y-1 ml-6">
                    {item.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-xs text-slate-400 flex items-start gap-1">
                        <span className="text-yellow-400 mt-0.5">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Why This Matters */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-xs text-blue-300">
            <strong>Why this matters:</strong> Higher quality job postings receive 3x more applications 
            and enable better AI matching between candidates and positions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
