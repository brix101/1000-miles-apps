import App from "@/App.tsx";
import QueryClientProvider from "@/provider/TanStackQueryClientProvider";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("top")!).render(
  <React.StrictMode>
    <QueryClientProvider>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
