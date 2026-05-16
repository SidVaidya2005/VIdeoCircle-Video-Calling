import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./shared/styles/tokens.css";
import "./shared/styles/globals.css";
import App from "./app/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
