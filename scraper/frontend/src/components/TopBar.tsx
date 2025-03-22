import Notifications from "@/components/popOvers/Notifications";
import Profile from "@/components/popOvers/Profile";
import { useBoundStore } from "@/store";

function TopBar() {
  const {
    ui: { isTopBarCollapse },
    setTopBarCollapse,
  } = useBoundStore();

  function toggleSideBarHidden() {
    setTopBarCollapse(!isTopBarCollapse);
  }

  return (
    <nav
      className="navbar navbar-top fixed-top navbar-expand"
      id="navbarDefault"
    >
      <div className="collapse navbar-collapse justify-content-between">
        <div className="navbar-logo">
          <button
            className="btn navbar-toggler navbar-toggler-humburger-icon hover-bg-transparent"
            type="button"
            onClick={toggleSideBarHidden}
          >
            <span className="navbar-toggle-icon">
              <span className="toggle-line"></span>
            </span>
          </button>
        </div>
        <div
          className="search-box navbar-top-search-box d-none d-lg-block"
          data-list='{"valueNames":["title"]}'
          style={{ width: "25rem" }}
        ></div>
        <ul className="navbar-nav navbar-nav-icons flex-row">
          <li className="nav-item">
            <div className="theme-control-toggle fa-icon-wait px-2">
              <input
                className="form-check-input ms-0 theme-control-toggle-input"
                type="checkbox"
                data-theme-control="phoenixTheme"
                value="dark"
                id="themeControlToggle"
              />
              <label
                className="mb-0 theme-control-toggle-label theme-control-toggle-light"
                htmlFor="themeControlToggle"
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                title="Switch theme"
              >
                <span className="icon" data-feather="moon"></span>
              </label>
              <label
                className="mb-0 theme-control-toggle-label theme-control-toggle-dark"
                htmlFor="themeControlToggle"
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                title="Switch theme"
              >
                <span className="icon" data-feather="sun"></span>
              </label>
            </div>
          </li>
          <li className="nav-item dropdown">
            <Notifications />
          </li>
          <li className="nav-item dropdown" style={{ width: 20 }}></li>
          <li className="nav-item dropdown">
            <Profile />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default TopBar;
