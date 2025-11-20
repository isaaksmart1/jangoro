import { useState } from "react";

import { Copy } from "lucide-react";

import tick from "../../assets/img/tick.png";

type Props = {
  text: string;
};

export const CopyToClipboardButton = ({ text }: Props) => {
  const [copy, setCopy] = useState(false);

  const copyToClipboard = () => {
    if (!text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopy(true);
        setTimeout(() => {
          setCopy(false);
        }, 3000);
      })
      .catch((error) => {
        alert("Failed to copy: " + error);
      });
  };

  return (
    <button
      onClick={copyToClipboard}
      style={{ marginLeft: 10, padding: 12 }}
    >
      {copy ? (
        <span className="flex flex-row">
          <img src={tick} style={{ width: 24, height: 24 }} />
          <p>Copied!</p>
        </span>
      ) : (
        <span className="flex flex-row">
          <Copy
            style={{ width: 24, height: 24, color: "#6F2EBE", marginRight: 6 }}
          />
          <span className="text-black">Copy Results</span>
        </span>
      )}
    </button>
  );
};
