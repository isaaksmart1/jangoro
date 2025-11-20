import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./css/index.css";
import "./css/main.css";

 
ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
