import queryClient from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";

type QueryClientProviderProps = {
  children: ReactNode;
};

function TanStackQueryClientProvider(props: QueryClientProviderProps) {
  const { children } = props;
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
export default TanStackQueryClientProvider;
