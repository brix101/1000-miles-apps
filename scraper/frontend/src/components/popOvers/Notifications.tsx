import { Icons } from "@/assets/icons";
import NotificationCard from "@/components/cards/NotificationCard";
import { useRef, useState } from "react";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import { useOnClickOutside } from "usehooks-ts";

type NotificationCardProps = React.ComponentProps<typeof NotificationCard>;

const notifs: Array<NotificationCardProps> = [
  {
    notifBody: (
      <div className="d-flex">
        <div className="avatar avatar-m me-3">
          <img
            className="rounded-circle"
            src="/src/assets/img/team/40x40/30.webp"
            alt=""
          />
        </div>
        <div className="flex-1 me-sm-3">
          <h4 className="fs--1 text-black">Giftcraft LTD</h4>
          <p className="fs--1 text-1000 mb-2 mb-sm-3 fw-normal">
            <span className="me-1 fs--2">
              <Icons.Ucube height={16} width={16} />
            </span>
            Posted
            <strong className="px-1">10 Products</strong>
            their website.
          </p>
          <p className="text-800 fs--1 mb-0">
            <Icons.UClockThree className="me-1" height={16} width={16} />
            <span className="fw-bold">10:41 AM </span>August 7,2021
          </p>
        </div>
      </div>
    ),
    isOpened: true,
  },
  {
    notifBody: (
      <div className="d-flex">
        <div className="avatar avatar-m me-3">
          <img
            className="rounded-circle"
            src="/src/assets/img/team/40x40/30.webp"
            alt=""
          />
        </div>
        <div className="flex-1 me-sm-3">
          <h4 className="fs--1 text-black">Cotton on</h4>
          <p className="fs--1 text-1000 mb-2 mb-sm-3 fw-normal">
            <span className="me-1 fs--2">
              <Icons.Ucube height={16} width={16} />
            </span>
            Posted
            <strong className="px-1">10 Products</strong>
            their website.
          </p>
          <p className="text-800 fs--1 mb-0">
            <Icons.UClockThree className="me-1" height={16} width={16} />
            <span className="fw-bold">10:41 AM </span>August 7,2021
          </p>
        </div>
      </div>
    ),
  },
  {
    notifBody: (
      <div className="d-flex">
        <div className="avatar avatar-m me-3">
          <img
            className="rounded-circle"
            src="/src/assets/img/team/40x40/30.webp"
            alt=""
          />
        </div>
        <div className="flex-1 me-sm-3">
          <h4 className="fs--1 text-black">Cotton on</h4>
          <p className="fs--1 text-1000 mb-2 mb-sm-3 fw-normal">
            <span className="me-1 fs--2">
              <Icons.Ucube height={16} width={16} />
            </span>
            Posted
            <strong className="px-1">10 Products</strong>
            their website.
          </p>
          <p className="text-800 fs--1 mb-0">
            <Icons.UClockThree className="me-1" height={16} width={16} />
            <span className="fw-bold">10:41 AM </span>August 7,2021
          </p>
        </div>
      </div>
    ),
  },
  {
    notifBody: (
      <div className="d-flex">
        <div className="avatar avatar-m me-3">
          <img
            className="rounded-circle"
            src="/src/assets/img/team/40x40/30.webp"
            alt=""
          />
        </div>
        <div className="flex-1 me-sm-3">
          <h4 className="fs--1 text-black">Cotton on</h4>
          <p className="fs--1 text-1000 mb-2 mb-sm-3 fw-normal">
            <span className="me-1 fs--2">
              <Icons.Ucube height={16} width={16} />
            </span>
            Posted
            <strong className="px-1">10 Products</strong>
            their website.
          </p>
          <p className="text-800 fs--1 mb-0">
            <Icons.UClockThree className="me-1" height={16} width={16} />
            <span className="fw-bold">10:41 AM </span>August 7,2021
          </p>
        </div>
      </div>
    ),
  },
  {
    notifBody: (
      <div className="d-flex">
        <div className="avatar avatar-m me-3">
          <img
            className="rounded-circle"
            src="/src/assets/img/team/40x40/30.webp"
            alt=""
          />
        </div>
        <div className="flex-1 me-sm-3">
          <h4 className="fs--1 text-black">Cotton on</h4>
          <p className="fs--1 text-1000 mb-2 mb-sm-3 fw-normal">
            <span className="me-1 fs--2">
              <Icons.Ucube height={16} width={16} />
            </span>
            Posted
            <strong className="px-1">10 Products</strong>
            their website.
          </p>
          <p className="text-800 fs--1 mb-0">
            <Icons.UClockThree className="me-1" height={16} width={16} />
            <span className="fw-bold">10:41 AM </span>August 7,2021
          </p>
        </div>
      </div>
    ),
  },
  {
    notifBody: (
      <div className="d-flex">
        <div className="avatar avatar-m me-3">
          <img
            className="rounded-circle"
            src="/src/assets/img/team/40x40/30.webp"
            alt=""
          />
        </div>
        <div className="flex-1 me-sm-3">
          <h4 className="fs--1 text-black">Cotton on</h4>
          <p className="fs--1 text-1000 mb-2 mb-sm-3 fw-normal">
            <span className="me-1 fs--2">
              <Icons.Ucube height={16} width={16} />
            </span>
            Posted
            <strong className="px-1">10 Products</strong>
            their website.
          </p>
          <p className="text-800 fs--1 mb-0">
            <Icons.UClockThree className="me-1" height={16} width={16} />
            <span className="fw-bold">10:41 AM </span>August 7,2021
          </p>
        </div>
      </div>
    ),
  },
  {
    notifBody: (
      <div className="d-flex">
        <div className="avatar avatar-m me-3">
          <img
            className="rounded-circle"
            src="/src/assets/img/team/40x40/30.webp"
            alt=""
          />
        </div>
        <div className="flex-1 me-sm-3">
          <h4 className="fs--1 text-black">Plaiso</h4>
          <p className="fs--1 text-1000 mb-2 mb-sm-3 fw-normal">
            <span className="me-1 fs--2">
              <Icons.Ucube height={16} width={16} />
            </span>
            Posted
            <strong className="px-1">10 Products</strong>
            their website.
          </p>
          <p className="text-800 fs--1 mb-0">
            <Icons.UClockThree className="me-1" height={16} width={16} />
            <span className="fw-bold">10:41 AM </span>August 7,2021
          </p>
        </div>
      </div>
    ),
  },
  {
    notifBody: (
      <div className="d-flex">
        <div className="avatar avatar-m me-3">
          <img
            className="rounded-circle"
            src="/src/assets/img/team/40x40/30.webp"
            alt=""
          />
        </div>
        <div className="flex-1 me-sm-3">
          <h4 className="fs--1 text-black">The Range</h4>
          <p className="fs--1 text-1000 mb-2 mb-sm-3 fw-normal">
            <span className="me-1 fs--2">
              <Icons.Ucube height={16} width={16} />
            </span>
            Posted
            <strong className="px-1">10 Products</strong>
            their website.
          </p>
          <p className="text-800 fs--1 mb-0">
            <Icons.UClockThree className="me-1" height={16} width={16} />
            <span className="fw-bold">10:41 AM </span>August 7,2021
          </p>
        </div>
      </div>
    ),
  },
];

function Notifications() {
  const [show, setShow] = useState(false);
  const targetRef = useRef(null);
  const ref = useRef(null);

  const handleBellClick = () => {
    setShow(!show);
  };

  useOnClickOutside(ref, () => setShow(false));
  return (
    <div ref={ref}>
      <div
        ref={targetRef}
        className="nav-link show"
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={handleBellClick}
      >
        <Icons.FiBell height={20} width={20} />
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
            className="dropdown-menu dropdown-menu-end notification-dropdown-menu py-0 shadow border border-300 navbar-dropdown-caret show"
            style={{ padding: 0 }}
          >
            <div className="card position-relative border-0">
              <div className="card-header p-2">
                <div className="d-flex justify-content-between">
                  <h5 className="text-black mb-0">Notificatons</h5>
                  {/* <button
                    className="btn btn-link p-0 fs--1 fw-normal"
                    type="button"
                  >
                    Mark all as read
                  </button> */}
                </div>
              </div>
              <div className="card-body p-0">
                <div
                  className="scrollbar-overlay"
                  style={{ height: "27rem" }}
                  data-simplebar="init"
                >
                  <div className="border-300">
                    {notifs.map((prop, index) => (
                      <NotificationCard key={index} {...prop} />
                    ))}
                  </div>
                </div>
              </div>
              {/* <div className="card-footer p-0 border-top border-0">
                <div className="my-2 text-center fw-bold fs--2 text-600">
                  <a className="fw-bolder" href="pages/notifications.html">
                    Notification history
                  </a>
                </div>
              </div> */}
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}

export default Notifications;
