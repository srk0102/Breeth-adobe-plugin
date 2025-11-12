import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { App } from "./main";

console.log('[Breeth] Plugin loading...');

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

console.log('[Breeth] Plugin loaded successfully!');
