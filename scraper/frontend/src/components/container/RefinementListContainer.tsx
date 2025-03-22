import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  label?: string;
}

function RefinementListContainer({ children, label }: Props) {
  return (
    <div className="ais-Panel border rounded-2 p-2 m-0">
      <div className="ais-Panel-header ">
        {label ? <span>{label}</span> : <></>}
      </div>
      <div className="ais-Panel-body">{children}</div>
    </div>
  );
}

export default RefinementListContainer;
