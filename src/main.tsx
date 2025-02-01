import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import "./css/main.css";
import App from "./App";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
