import { Icons } from "@/assets/icons";
import moment from "moment";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

type Props = {
  notifBody: React.ReactNode;
  isOpened?: boolean;
};

function NotificationCard(props: Props) {
  const [isEllipsisOpen, setEllipsisOpen] = useState(false);
  const [isOpened, setOpened] = useState(props.isOpened);
  const ref = useRef(null);

  const handleEllipsisClick = () => {
    setEllipsisOpen((prev) => !prev);
  };
  const handleMarkAsUnreadClick = () => {
    setOpened((prev) => !prev);
    setEllipsisOpen(false);
  };

  useOnClickOutside(ref, () => setEllipsisOpen(false));
  const databaseDateTime = "2023-06-21T04:23:01.382Z";
  const datetime = moment(databaseDateTime, "YYYY-MM-DD HH:mm:ss")
    .format("h:mm A--MMMM D, YYYY")
    .split("--");

  return (
    <div
      className={`px-2 px-sm-3 py-3 border-300 notification-card position-relative border-bottom ${
        isOpened ? "read" : "unread"
      }`}
    >
      <div className="d-flex align-items-center justify-content-between position-relative">
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
              <span className="fw-bold">{datetime[0]} </span>
              {datetime[1]}
            </p>
          </div>
        </div>
        <div className="font-sans-serif d-none d-sm-block" ref={ref}>
          <button
            className={`btn fs--2 btn-sm dropdown-toggle dropdown-caret-none transition-none notification-dropdown-toggle ${
              isEllipsisOpen ? "show" : ""
            }`}
            type="button"
            onClick={handleEllipsisClick}
          >
            <Icons.UEllipsisH
              className="fs--2 text-900"
              height={10}
              width={10}
            />
          </button>
          <div
            className={`dropdown-menu dropdown-menu-end py-2 w-100 ${
              isEllipsisOpen ? "show" : ""
            }`}
          >
            <button className="dropdown-item" onClick={handleMarkAsUnreadClick}>
              Mark as {isOpened ? "unread" : "read"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
