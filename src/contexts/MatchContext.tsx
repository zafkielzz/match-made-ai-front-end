import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

interface MatchResult {
  jobId: string;
  score: number;
}

interface MatchContextType {
  matchResults: MatchResult[];
  setMatchResults: (results: MatchResult[]) => void;
  uploadedCV: File | null;
  setUploadedCV: (file: File | null) => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [uploadedCV, setUploadedCV] = useState<File | null>(null);

  const value = useMemo(
    () => ({ matchResults, setMatchResults, uploadedCV, setUploadedCV }),
    [matchResults, uploadedCV],
  );
  return (
    <MatchContext.Provider value={value}>{children}</MatchContext.Provider>
  );
};

export const useMatch = () => {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error("useMatch must be used within MatchProvider");
  return ctx;
};
