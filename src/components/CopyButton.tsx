import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface Props {
  text: string;
}

export default function CopyButton({ text }: Props) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(text);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <div className="p-2 bg-background/40 rounded-md cursor-pointer">
      {!isCopied ? (
        <Copy className="w-4 h-4" onClick={() => handleCopy()} />
      ) : (
        <Check className="w-4 h-4" />
      )}
    </div>
  );
}
