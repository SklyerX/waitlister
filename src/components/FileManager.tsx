import { FileUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import importSubscribers from "@/hooks/react-query/import";

export default function FileManager() {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [emails, setEmails] = useState<string[] | []>([]);

  const onDrop = (acceptedFile: File[]) => {
    if (acceptedFile.length > 0) {
      setSelectedFile(acceptedFile[0]);
    }
  };

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
    },
    maxSize: 5000000,
  });

  useEffect(() => {
    if (selectedFile) {
      try {
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const emails = text.trim().split(",");

          setEmails(emails);
        };
      } catch (err) {
        toast.error(
          (err as { message: string }).message ||
            "Something went wrong while reading the document"
        );
      }
    }
  }, [selectedFile]);

  const { mutate, isLoading } = importSubscribers();

  return (
    <div>
      <div
        className="w-full border-2 py-10 border-dashed p-4 rounded-md flex flex-col items-center justify-center"
        aria-disabled={isLoading}
        {...getRootProps()}
      >
        <FileUp className="w-8 h-8 text-muted-foreground" />
        <input {...getInputProps()} />
        <p className="text-muted-foreground/50 mt-2 text-sm">
          {selectedFile ? (
            <span className="text-foreground">{selectedFile.name}</span>
          ) : (
            <>
              <span className="text-foreground">Upload a file</span> or drag and
              drop
            </>
          )}
        </p>
        <span className="text-xs text-muted-foreground/80">
          .csv, up to 5MB
        </span>
      </div>
      {emails.length !== 0 ? (
        <div className="mt-8">
          <div className="border rounded-md p-4 flex flex-col gap-1">
            {emails.map((email, index) => (
              <span key={index}>{email}</span>
            ))}
          </div>

          <Button
            isLoading={isLoading}
            className="mt-4"
            onClick={() => mutate(emails)}
          >
            Import
          </Button>
        </div>
      ) : null}
    </div>
  );
}
