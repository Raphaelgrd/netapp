import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return React.createElement("div", { className: "p-8 text-2xl" }, "✅ Ça marche");
}

createRoot(document.getElementById("root")).render(React.createElement(App));
