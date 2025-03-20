import { ReactNode } from "react";

interface PageHeaderContainerProps {
  children: ReactNode;
}

function PageHeaderContainer({ children }: PageHeaderContainerProps) {
  return <h2 className="text-bold text-1100 mb-5">{children}</h2>;
}

export default PageHeaderContainer;
