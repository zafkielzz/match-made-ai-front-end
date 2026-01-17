import { useState, useCallback } from "react";
import { Upload, FileText, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/Icon";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const FileUpload = ({ onFileSelect, selectedFile }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        const file = files[0];
        if (isValidFile(file)) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const isValidFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return validTypes.includes(file.type);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const removeFile = () => {
    onFileSelect(null);
  };

  if (selectedFile) {
    return (
      <div className="rounded-2xl border-2 border-success/50 bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 border border-success/20">
              <Icon icon={FileText} size={20} className="text-success" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-success font-medium">
              <Icon icon={Check} size={16} className="text-success" />
              <span>Ready</span>
            </div>
            <button
              onClick={removeFile}
              className="rounded-lg p-2 text-foreground hover:bg-accent transition-all duration-200"
            >
              <Icon icon={X} size={16} className="text-foreground" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300",
        isDragging
          ? "border-primary bg-success/20 shadow-lg"
          : "border-border bg-card hover:border-primary hover:bg-accent hover:shadow-md"
      )}
    >
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileInput}
        className="absolute inset-0 cursor-pointer opacity-0"
      />

      <div className="flex flex-col items-center">
        <div
          className={cn(
            "mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 border-2",
            isDragging
              ? "bg-success border-primary"
              : "bg-background border-border hover:bg-accent"
          )}
        >
          <Icon icon={Upload} size={32} className={isDragging ? "text-foreground" : "text-primary"} />
        </div>

        <p className="mb-2 text-lg font-semibold text-foreground">
          {isDragging ? "Drop your CV here" : "Drag and drop your CV"}
        </p>
        <p className="mb-4 text-foreground">
          or <span className="text-primary font-medium hover:text-accent transition-colors">browse files</span>
        </p>
        <p className="text-sm text-foreground">
          Supports PDF and DOCX formats
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
