"use client";

import { UploadCloud } from "lucide-react";
import { useId, useState } from "react";

export default function UploadDropzone({
  accept,
  multiple = false,
  disabled = false,
  onFilesSelected,
  title = "Click to upload or drag and drop",
  subtitle = "",
  className = "",
}) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length || disabled) {
      return;
    }
    onFilesSelected?.(files);
  };

  const handlePaste = (event) => {
    if (disabled) {
      return;
    }

    const clipboardItems = Array.from(event.clipboardData?.items || []);
    const pastedFiles = clipboardItems
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile())
      .filter(Boolean);

    if (pastedFiles.length > 0) {
      event.preventDefault();
      handleFiles(pastedFiles);
    }
  };

  return (
    <div className={className}>
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <label
        htmlFor={inputId}
        tabIndex={disabled ? -1 : 0}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) {
            setIsDragging(true);
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        onPaste={handlePaste}
        className={`mt-1 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-5 text-center transition ${
          disabled
            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
            : isDragging
              ? "border-green-600 bg-green-50 text-green-800"
              : "border-gray-300 bg-white text-gray-700 hover:border-green-500 hover:bg-green-50"
        }`}
      >
        <UploadCloud className="mb-2 h-6 w-6" />
        <div className="font-semibold">{title}</div>
        <div className="mt-1 text-sm text-gray-500">
          {subtitle || "Drag, click, or paste files here"}
        </div>
      </label>
    </div>
  );
}
