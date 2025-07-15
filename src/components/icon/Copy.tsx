import { useState } from "react";

import clipboard from "../../assets/img/copy.png";
import tick from "../../assets/img/tick.png";
import { Copy } from "lucide-react";

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
      style={{ marginLeft: 10, padding: 12, color: "#CCCCCC" }}
    >
      {copy ? (
        <span className="flex flex-row">
          <img src={tick} style={{ width: 24, height: 24 }} />
          <p>copied!</p>
        </span>
      ) : (
        <span className="flex flex-row text-gray-500">
          <Copy
            style={{ width: 24, height: 24, color: "gray", marginRight: 6 }}
          />
          Copy Results
        </span>
      )}
    </button>
  );
};
