import AvatarContainer from "@/components/container/avatar-container";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useLogOutMutation } from "@/hooks/mutations/useLogOutMutation";
import useBoundStore from "@/hooks/useBoundStore";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

function ProfileContainer() {
  const containerRef = useRef(null);
  const {
    auth: { user },
  } = useBoundStore();
  const logoutMutation = useLogOutMutation();

  const [expanded, setExpanded] = useState(false);

  const show = expanded ? "show" : "";

  useOnClickOutside(containerRef, () => setExpanded(false));

  function handleLogoutClick() {
    setExpanded(false);
    logoutMutation.mutate();
  }

  if (!user) return null;

  return (
    <div ref={containerRef}>
      <button
        className={cn("btn nav-link lh-1 pe-0", show)}
        id="navbarDropdownUser"
        role="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-haspopup="true"
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="avatar avatar-l ">
          <AvatarContainer name={user.name} />
        </div>
      </button>
      <div
        className={cn(
          "dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border border-300",
          show
        )}
        aria-labelledby="navbarDropdownUser"
        data-bs-popper="static"
      >
        <div className="card position-relative border-0">
          <div className="card-body p-0">
            <div className="text-center pt-4 pb-3">
              <div className="avatar avatar-xl ">
                <AvatarContainer name={user.name} />
              </div>
              <h6 className="mt-2 text-black">{user.name}</h6>
            </div>
          </div>
          <div className="card-footer p-0 border-top">
            <div className="p-3">
              <Button
                variant="phoenix-secondary"
                className="d-flex flex-center w-100"
                onClick={handleLogoutClick}
              >
                <Icons.ULogout className="me-2" height="16px" width="16px" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ProfileContainer };
