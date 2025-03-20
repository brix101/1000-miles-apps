import { ProfileContainer } from "@/components/container/profile-container";
import useBoundStore from "@/hooks/useBoundStore";

function NavBarTop() {
  const toggleSideBarVisibility = useBoundStore(
    (store) => store.toggleSideBarShow
  );

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
            onClick={() => toggleSideBarVisibility()}
          >
            <span className="navbar-toggle-icon">
              <span className="toggle-line"></span>
            </span>
          </button>
        </div>
        <div
          className="search-box navbar-top-search-box d-none d-lg-block"
          style={{ width: "25rem" }}
        ></div>
        <ul className="navbar-nav navbar-nav-icons flex-row">
          <li className="nav-item dropdown">
            <ProfileContainer />
          </li>
        </ul>
      </div>
    </nav>
  );
}

function NavBarTopLoader() {
  return (
    <nav className="navbar navbar-top fixed-top navbar-expand ">
      <div className="collapse navbar-collapse justify-content-between placeholder-glow">
        <div></div>
        <div className="avatar avatar-xl ">
          <div className="avatar-name rounded-circle">
            <span className="placeholder"></span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export { NavBarTop, NavBarTopLoader };
