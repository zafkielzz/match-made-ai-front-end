import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { validateJobForm, JobFormValidationResult } from "@/utils/jobValidation";
import { calculateQualityScore } from "@/utils/qualityScore";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QualityCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: any;
  onConfirm: () => void;
  loading: boolean;
}

export const QualityCheckDialog: React.FC<QualityCheckDialogProps> = ({
  open,
  onOpenChange,
  formData,
  onConfirm,
  loading,
}) => {
  const validation: JobFormValidationResult = validateJobForm(formData);
  const qualityScore = calculateQualityScore(formData);
  
  const hasBlockingErrors = !validation.valid;
  const hasWarnings = Object.keys(validation.warnings).length > 0;
  const isPublishing = formData.jobStatus === "PUBLISHED";
  
  const canPublish = !hasBlockingErrors;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-card border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {hasBlockingErrors ? (
              <XCircle className="w-6 h-6 text-red-400" />
            ) : hasWarnings ? (
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            )}
            Quality Check Summary
          </DialogTitle>
          <DialogDescription>
            {isPublishing
              ? "Review the quality of your job posting before publishing"
              : "Review the quality of your job posting before saving"}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-4">
            {/* Quality Score */}
            <div className="bg-black/30 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Quality Score</span>
                <span className={`text-2xl font-bold ${
                  qualityScore.totalScore >= 70 ? "text-green-400" : 
                  qualityScore.totalScore >= 50 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {qualityScore.totalScore}/100
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {qualityScore.overallSuggestions[0]}
              </p>
            </div>
            
            {/* Blocking Errors */}
            {hasBlockingErrors && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-300">
                      Blocking Issues ({Object.keys(validation.errors).length})
                    </h3>
                    <p className="text-xs text-red-400 mt-1">
                      These must be fixed before {isPublishing ? "publishing" : "saving"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 ml-7">
                  {Object.entries(validation.errors).map(([field, errors]) => (
                    <div key={field}>
                      <p className="text-sm font-medium text-white capitalize mb-1">
                        {field.replace(/([A-Z])/g, ' $1').trim()}:
                      </p>
                      <ul className="space-y-1">
                        {errors.map((error, idx) => (
                          <li key={idx} className="text-xs text-red-300 flex items-start gap-1">
                            <span className="mt-1">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Warnings */}
            {hasWarnings && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-yellow-300">
                      Warnings ({Object.keys(validation.warnings).length})
                    </h3>
                    <p className="text-xs text-yellow-400 mt-1">
                      Recommended improvements (you can proceed anyway)
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 ml-7">
                  {Object.entries(validation.warnings).map(([field, warnings]) => (
                    <div key={field}>
                      <p className="text-sm font-medium text-white capitalize mb-1">
                        {field.replace(/([A-Z])/g, ' $1').trim()}:
                      </p>
                      <ul className="space-y-1">
                        {warnings.map((warning, idx) => (
                          <li key={idx} className="text-xs text-yellow-300 flex items-start gap-1">
                            <span className="mt-1">•</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Success State */}
            {!hasBlockingErrors && !hasWarnings && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-green-300">
                      All Checks Passed!
                    </h3>
                    <p className="text-xs text-green-400 mt-1">
                      Your job posting meets all quality requirements and is ready to {isPublishing ? "publish" : "save"}.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quality Breakdown */}
            {!hasBlockingErrors && qualityScore.totalScore < 85 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-300">
                      Suggestions to Improve Quality
                    </h3>
                  </div>
                </div>
                
                <div className="space-y-2 ml-7">
                  {qualityScore.breakdown
                    .filter(item => item.suggestions.length > 0)
                    .map((item, idx) => (
                      <div key={idx}>
                        <p className="text-xs font-medium text-white mb-1">
                          {item.category}:
                        </p>
                        <ul className="space-y-1">
                          {item.suggestions.map((suggestion, sidx) => (
                            <li key={sidx} className="text-xs text-blue-300 flex items-start gap-1">
                              <span className="mt-1">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Go Back & Edit
          </Button>
          
          <Button
            type="button"
            onClick={onConfirm}
            disabled={!canPublish || loading}
            className={canPublish ? "bg-primary hover:bg-primary/90" : ""}
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                {isPublishing ? "Publish Job" : "Save as Draft"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
