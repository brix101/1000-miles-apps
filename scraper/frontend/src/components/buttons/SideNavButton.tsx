import { useBoundStore } from "@/store";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type Props = React.ComponentProps<typeof NavLink> & {
  children?: ReactNode;
  label?: string;
};

function SideNavButton({ children, label, ...props }: Props) {
  const { setTopBarCollapse } = useBoundStore();

  function collapseAfterClick() {
    setTopBarCollapse(false);
  }
  return (
    <NavLink
      {...props}
      className={({ isActive }) => {
        return `nav-link  ${isActive ? "active" : ""}`;
      }}
      onClick={collapseAfterClick}
    >
      <div className="d-flex align-items-center">
        {children ? <span className="nav-link-icon">{children}</span> : <></>}
        {label ? (
          <span className="nav-link-text px-0 text-capitalize">{label}</span>
        ) : (
          <></>
        )}
      </div>
    </NavLink>
  );
}

export default SideNavButton;
