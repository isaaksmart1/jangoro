import React, { useEffect, useState } from "react";

import { Card } from "antd";

import { Text } from "@/components";
import { AI_URL, authProvider } from "@/providers";
import { wsClient, wsSession } from "@/utilities/ws";

import { UploadFilesButton } from "../actions-buttons";
import Login, { Feedback } from "./email";
import { NoFiles as CsvNoFiles } from "./csv";
import CSV from "./csv";

type Props = {
  files: any;
  setFiles: any;
  selectedFiles: any;
  setSelectedFiles: any;
};

const upload: {
  [key: string]: (setFiles: any, login: any, update: any) => React.JSX.Element;
} = {
  csv: (setFiles: any, _login: any) => {
    return (
      <React.Fragment>
        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
          CSV Format
        </span>
        <UploadFilesButton setFiles={setFiles} />
      </React.Fragment>
    );
  },
  email: (setFiles: any, login: any) => {
    return (
      <React.Fragment>
        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
          Email
        </span>
        <button
          onClick={login}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-500 text-white p-4 rounded-lg"
          style={{ color: "#FFFFFF" }}
        >
          Connect
        </button>
      </React.Fragment>
    );
  },
  builder: (_setFiles: any, _login: any, update: any) => {
    return (
      <React.Fragment>
        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
          Responses
        </span>
        <button
          onClick={update}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-500 text-white p-4 rounded-lg"
          style={{ color: "#FFFFFF" }}
        >
          Update
        </button>
      </React.Fragment>
    );
  },
};

export const FileList = ({
  files,
  setFiles,
  selectedFiles,
  setSelectedFiles,
}: Props) => {
  const [uploadType, setUploadType] = useState("csv");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [provider, setProvider] = useState("gmail");
  const [onLoggedIn, setOnLoggedIn] = useState<any>(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    wsClient.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "csv-sync") {
        const { filename, contentType, data } = message.payload;

        // Decode base64 string to binary data
        const byteCharacters = atob(data);
        const byteNumbers = Array.from(byteCharacters, (char) =>
          char.charCodeAt(0),
        );
        const byteArray = new Uint8Array(byteNumbers);

        // Create a File object (or Blob)
        const file = new File([byteArray], filename, { type: contentType });
        const csvFiles = [file].map((file: any) => {
          return {
            name: file.name,
            file,
            type: file.type,
          };
        });
        setFiles(csvFiles);
      }
    };
  }, [wsSession]);

  const onFileSelectChange = async (file: any) => {
    const idx = selectedFiles.indexOf(file);
    if (idx > -1) {
      const files = [...selectedFiles];
      files.splice(idx, 1);
      setSelectedFiles(files);
    } else {
      const files = [...selectedFiles, file];
      setSelectedFiles(files);
    }
  };

  const onEmailBodySelectChange = async (original: any) => {
    const payload = original.subject.split("=?")[0];
    const idx = selectedFiles.indexOf(payload);
    if (idx > -1) {
      const emails = [...selectedFiles];
      emails.splice(idx, 1);
      setSelectedFiles(emails);
    } else {
      const emails = [...selectedFiles, payload];
      setSelectedFiles(emails);
    }
  };

  const update = async () => {
    const user = await authProvider.getIdentity();
    const customerEmail = user.email || "";
    // Fetch a list of csv files from the backend
    const res = await fetch(
      `${AI_URL}/survey-builder/responses?email=${customerEmail}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await res.json();

    const csvFiles = data.surveys.map((f: any) => {
      const byteString = atob(f.base64);
      const array = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        array[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([array], { type: f.type });

      const file = new File([blob], f.name, {
        type: f.type,
        lastModified: f.lastModified,
      });

      return { name: f.name, file, type: f.type };
    });

    setFiles(csvFiles);
  };

  const login = async () => {
    const res = await fetch(`${AI_URL}/login-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        provider,
      }),
    });
    const data = await res.json();
    setOnLoggedIn(data.session_id);
  };

  return (
    <Card
      id="file-explorer"
      style={{
        height: "100%",
        padding: "1rem",
        overflowX: "hidden",
        overflowY: "scroll",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
      headStyle={{ padding: "8px 16px" }}
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <select
            onChange={(e) => {
              localStorage.setItem("uploadType", e.target.value);
              setUploadType(e.target.value);
            }}
            defaultValue="csv"
          >
            <option
              value="csv"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Text size="lg" style={{ marginLeft: ".7rem", color: "#000000" }}>
                Upload CSV Data
              </Text>
            </option>
            <option
              value="email"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Text size="lg" style={{ marginLeft: ".7rem", color: "#000000" }}>
                Upload Email Data
              </Text>
            </option>
            <option
              value="builder"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Text size="lg" style={{ marginLeft: ".7rem", color: "#000000" }}>
                Upload Survey Builder Data
              </Text>
            </option>
          </select>
          {upload[uploadType](setFiles, login, update)}
        </div>
      }
    >
      {uploadType === "csv" ? (
        isLoading ? (
          <CsvNoFiles files={files} />
        ) : (
          <CSV files={files} onFileSelectChange={onFileSelectChange} />
        )
      ) : uploadType === "email" ? (
        !onLoggedIn ? (
          <Login
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            provider={provider}
            setProvider={setProvider}
          />
        ) : (
          <Feedback
            sessionId={onLoggedIn}
            onSelect={onEmailBodySelectChange}
            setFiles={setFiles}
          />
        )
      ) : uploadType === "builder" ? (
        <CSV files={files} onFileSelectChange={onFileSelectChange} />
      ) : (
        <></>
      )}

      {uploadType === "csv" && !isLoading && files?.length === 0 && <NoFiles />}
    </Card>
  );
};

const NoFiles = () => (
  <span
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "220px",
      color: "#CCCCCC",
    }}
  >
    No files uploaded yet.
  </span>
);
