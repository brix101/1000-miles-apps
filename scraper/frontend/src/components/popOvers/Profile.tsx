import ImageContainer from "@/components/container/ImageContainer";
import { STATIC_URL } from "@/constant/server.constant";
import { useBoundStore } from "@/store";
import { useRef, useState } from "react";
import { Overlay, Popover } from "react-bootstrap";
import { useOnClickOutside } from "usehooks-ts";
import AvatarContainer from "../container/AvatarContainer";

function Profile() {
  const {
    auth: { user },
    logout,
  } = useBoundStore();
  const [show, setShow] = useState(false);
  const targetRef = useRef(null);
  const ref = useRef(null);

  const handleProfileClick = () => {
    setShow(!show);
  };

  const handleLogoutClick = () => {
    logout();
  };

  useOnClickOutside(ref, () => setShow(false));

  const name = user?.name;
  const imageUrl = STATIC_URL + "/users/" + user?.image_url;
  const profileImage = user?.image_url ? (
    <ImageContainer className="rounded-circle" src={imageUrl} alt={user?.id} />
  ) : (
    <AvatarContainer name={name ?? ""} />
  );

  return (
    <div ref={ref}>
      <div
        ref={targetRef}
        className="nav-link lh-1 pe-0 show"
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={handleProfileClick}
      >
        <div className="avatar avatar-m border rounded-circle overflow-hidden">
          {profileImage}
        </div>
      </div>
      <Overlay
        show={show}
        target={targetRef}
        placement="bottom-end"
        container={ref}
        containerPadding={20}
      >
        <Popover id="popover-contained">
          <style>{`.popover-arrow { display: none !important; }`}</style>
          <Popover.Body
            as="div"
            className="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border border-300 show"
          >
            <div className="card position-relative border-0">
              <div className="card-body p-0">
                <div className="text-center pt-4 pb-3">
                  <div className="avatar avatar-xl border rounded-circle overflow-hidden">
                    {profileImage}
                  </div>
                  <h6 className="mt-2 text-black">{name}</h6>
                </div>
              </div>
              <div className="card-footer p-0 border-top">
                <div className="p-3">
                  <button
                    className="btn btn-phoenix-secondary d-flex flex-center w-100"
                    onClick={handleLogoutClick}
                  >
                    <span className="me-2" data-feather="log-out"></span>
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}

export default Profile;
