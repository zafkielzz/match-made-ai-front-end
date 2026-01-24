import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ChevronDown, ChevronUp, X, Award } from "lucide-react";

export type LanguageProficiency = "BASIC" | "INTERMEDIATE" | "FLUENT" | "NATIVE";

export interface LanguageCertificate {
  type: string; // e.g., "IELTS", "TOEIC", "JLPT"
  scoreOrLevel?: string; // e.g., "7.5", "N2", "850"
  score?: string; // Backward compatibility alias for scoreOrLevel
  customName?: string; // For "Other" certificate type
}

export interface LanguageRequirement {
  languageCode: string; // ISO 639-1 code (e.g., "en", "de", "ja")
  language: string; // Display name (e.g., "English", "German")
  proficiency: LanguageProficiency;
  certificate?: LanguageCertificate;
}

interface LanguageRequirementsProps {
  value: LanguageRequirement[];
  onChange: (value: LanguageRequirement[]) => void;
  required?: boolean;
}

// Common languages with ISO codes
const COMMON_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "vi", name: "Vietnamese" },
  { code: "zh", name: "Chinese (Mandarin)" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
];

// Language-specific certificate mapping
const LANGUAGE_CERTIFICATES: Record<string, string[]> = {
  English: ["IELTS", "TOEFL", "TOEIC", "Cambridge English", "CEFR"],
  Japanese: ["JLPT"],
  Korean: ["TOPIK"],
  "Chinese (Mandarin)": ["HSK"],
  French: ["DELF/DALF", "TCF"],
  German: ["TestDaF", "Goethe-Zertifikat"],
  Spanish: ["DELE", "SIELE"],
  Portuguese: ["CELPE-Bras"],
  Russian: ["TORFL"],
  Arabic: ["ALPT"],
  Vietnamese: [], // Typically no standardized certificates
  Hindi: [], // Typically no standardized certificates
  Thai: [], // Typically no standardized certificates
  Indonesian: [], // Typically no standardized certificates
  Malay: [], // Typically no standardized certificates
};

// Get available certificates for a language
const getCertificatesForLanguage = (language: string): string[] => {
  const certs = LANGUAGE_CERTIFICATES[language] || [];
  // Always add "Other" option
  return certs.length > 0 ? [...certs, "Other"] : ["Other"];
};

export const LanguageRequirements: React.FC<LanguageRequirementsProps> = ({
  value,
  onChange,
  required = false,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [languageChangeNotices, setLanguageChangeNotices] = useState<Set<number>>(new Set());

  const addLanguage = () => {
    onChange([
      ...value,
      {
        languageCode: "",
        language: "",
        proficiency: "INTERMEDIATE",
      },
    ]);
  };

  const removeLanguage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const updateLanguage = (
    index: number,
    field: keyof LanguageRequirement,
    fieldValue: any
  ) => {
    const updated = [...value];
    
    // Special handling for language change
    if (field === "language") {
      const oldLanguage = updated[index].language;
      const newLanguage = fieldValue;
      const currentCertificate = updated[index].certificate;
      
      // Find the language code
      const langObj = COMMON_LANGUAGES.find(l => l.name === newLanguage);
      const languageCode = langObj?.code || "";
      
      // If language changed and there's a certificate
      if (oldLanguage && newLanguage !== oldLanguage && currentCertificate?.type) {
        const availableCerts = getCertificatesForLanguage(newLanguage);
        
        // Check if current certificate is valid for new language
        if (!availableCerts.includes(currentCertificate.type)) {
          // Clear certificate and show notice
          updated[index] = {
            ...updated[index],
            languageCode,
            language: newLanguage,
            certificate: undefined,
          };
          
          // Show notice temporarily
          setLanguageChangeNotices((prev) => {
            const next = new Set(prev);
            next.add(index);
            return next;
          });
          
          // Remove notice after 5 seconds
          setTimeout(() => {
            setLanguageChangeNotices((prev) => {
              const next = new Set(prev);
              next.delete(index);
              return next;
            });
          }, 5000);
          
          onChange(updated);
          return;
        }
      }
      
      // Update both languageCode and language
      updated[index] = { ...updated[index], languageCode, language: newLanguage };
      onChange(updated);
      return;
    }
    
    updated[index] = { ...updated[index], [field]: fieldValue };
    onChange(updated);
  };

  const clearCertificate = (index: number) => {
    const updated = [...value];
    updated[index] = {
      ...updated[index],
      certificate: undefined,
    };
    onChange(updated);
    // Also collapse the section
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const toggleExpanded = (index: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const formatProficiency = (level: LanguageProficiency): string => {
    const map: Record<LanguageProficiency, string> = {
      BASIC: "Basic",
      INTERMEDIATE: "Intermediate",
      FLUENT: "Fluent",
      NATIVE: "Native",
    };
    return map[level];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>
          Language Requirements {required && <span className="text-red-400">*</span>}
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addLanguage}
          className="border-white/10 hover:bg-white/5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </div>

      {value.length === 0 && (
        <div className="text-sm text-slate-400 bg-slate-800/30 rounded-lg p-4 border border-white/10">
          No language requirements added. Click "Add Language" to specify required languages.
        </div>
      )}

      <div className="space-y-3">
        {value.map((lang, index) => {
          const isExpanded = expandedRows.has(index);
          const hasCertificate = !!(lang.certificate?.type || lang.certificate?.score);

          return (
            <div
              key={index}
              className="bg-slate-800/50 rounded-lg border border-white/10 p-4 space-y-3"
            >
              {/* Main Row - All controls aligned */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                {/* Language Select */}
                <div className="md:col-span-4 space-y-1">
                  <Label className="text-xs text-slate-400">Language</Label>
                  <Select
                    value={lang.language}
                    onValueChange={(v) => updateLanguage(index, "language", v)}
                  >
                    <SelectTrigger className="bg-background border-white/10 h-10">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 z-[200]">
                      {COMMON_LANGUAGES.map((l) => (
                        <SelectItem key={l.code} value={l.name}>
                          {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Proficiency Select */}
                <div className="md:col-span-4 space-y-1">
                  <Label className="text-xs text-slate-400">Proficiency</Label>
                  <Select
                    value={lang.proficiency}
                    onValueChange={(v) =>
                      updateLanguage(index, "proficiency", v as LanguageProficiency)
                    }
                  >
                    <SelectTrigger className="bg-background border-white/10 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10 z-[200]">
                      <SelectItem value="BASIC">Basic</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="FLUENT">Fluent</SelectItem>
                      <SelectItem value="NATIVE">Native</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Certificate Toggle & Delete - Aligned with selects */}
                <div className="md:col-span-4 flex items-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toggleExpanded(index)}
                    className="flex-1 border-white/10 hover:bg-white/5 h-10"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Hide Certificate
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        {hasCertificate ? "Show Certificate" : "Add Certificate"}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLanguage(index)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-10 px-3"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Certificate Indicator (when collapsed with certificate) */}
              {!isExpanded && hasCertificate && (
                <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 rounded px-3 py-2">
                  <div className="flex items-center gap-2 text-xs text-blue-300">
                    <Award className="w-3 h-3" />
                    <span>
                      {lang.certificate?.type === "Other" && lang.certificate?.customName
                        ? lang.certificate.customName
                        : lang.certificate?.type}
                      {lang.certificate?.score && `: ${lang.certificate.score}`}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => clearCertificate(index)}
                    className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                </div>
              )}

              {/* Certificate Section (Expandable) */}
              {isExpanded && (
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      Optional: Add language certificate details
                    </p>
                    {hasCertificate && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => clearCertificate(index)}
                        className="h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear Certificate
                      </Button>
                    )}
                  </div>

                  {/* Language change notice */}
                  {languageChangeNotices.has(index) && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded px-3 py-2 text-xs text-yellow-300">
                      Certificate cleared due to language change
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Certificate Type */}
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">
                        Certificate Type
                      </Label>
                      <Select
                        value={lang.certificate?.type || ""}
                        onValueChange={(v) =>
                          updateLanguage(index, "certificate", {
                            ...lang.certificate,
                            type: v,
                            score: lang.certificate?.score || "",
                            customName: v === "Other" ? lang.certificate?.customName || "" : undefined,
                          })
                        }
                        disabled={!lang.language}
                      >
                        <SelectTrigger className="bg-background border-white/10">
                          <SelectValue 
                            placeholder={
                              lang.language 
                                ? "Select certificate" 
                                : "Select language first"
                            } 
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10 z-[200]">
                          {lang.language ? (
                            getCertificatesForLanguage(lang.language).map((cert) => (
                              <SelectItem key={cert} value={cert}>
                                {cert}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="__disabled__" disabled>
                              Select a language first
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {!lang.language && (
                        <p className="text-xs text-slate-500">
                          Please select a language to see available certificates
                        </p>
                      )}
                    </div>

                    {/* Certificate Score/Level */}
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">
                        Score / Level
                      </Label>
                      <Input
                        value={lang.certificate?.score || ""}
                        onChange={(e) =>
                          updateLanguage(index, "certificate", {
                            type: lang.certificate?.type || "",
                            score: e.target.value,
                            customName: lang.certificate?.customName,
                          })
                        }
                        placeholder="e.g. 7.5, N2, 850"
                        className="bg-background border-white/10"
                        disabled={!lang.certificate?.type}
                      />
                      <p className="text-xs text-slate-500">
                        Optional: Enter score or level if applicable
                      </p>
                    </div>
                  </div>

                  {/* Custom Certificate Name (for "Other" option) */}
                  {lang.certificate?.type === "Other" && (
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">
                        Certificate Name
                      </Label>
                      <Input
                        value={lang.certificate?.customName || ""}
                        onChange={(e) =>
                          updateLanguage(index, "certificate", {
                            type: "Other",
                            score: lang.certificate?.score || "",
                            customName: e.target.value,
                          })
                        }
                        placeholder="Enter certificate name"
                        className="bg-background border-white/10"
                      />
                      <p className="text-xs text-slate-500">
                        Specify the name of the certificate
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {value.length > 0 && (
        <p className="text-xs text-slate-400">
          {value.length} language{value.length !== 1 ? "s" : ""} required
        </p>
      )}
    </div>
  );
};
