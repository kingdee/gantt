import "./index.css";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import '@kdcloudjs/kdesign/dist/kdesign.min.css'

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
