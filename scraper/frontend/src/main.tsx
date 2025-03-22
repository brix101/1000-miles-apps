import App from "@/App.tsx";
import ScreenSizeIndicator from "@/components/ScreenSizeIndicator.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: true,
    },
  },
});

const isDev = import.meta.env.VITE_NODE_ENV === "dev";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {isDev ? (
        <>
          <ScreenSizeIndicator />
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </>
      ) : (
        <></>
      )}
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
);
