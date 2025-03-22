import { Icons } from "@/assets/icons";
import { Buttons } from "@/components/buttons";
import { useBoundStore } from "@/store";
import { useState } from "react";
import { Box, User, UserPlus, Users } from "react-feather";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const [isCustOpen, setCustOpen] = useState(false);
  const [isProdOpen, setProdOpen] = useState(false);

  const {
    ui: { isSideBarCollapse, isTopBarCollapse },
    auth: { user },
    setTopBarCollapse,
    setSideBarCollapse,
  } = useBoundStore();

  function collapseAfterClick() {
    setTopBarCollapse(false);
  }

  return (
    <nav className="navbar navbar-vertical navbar-expand-lg">
      <div
        className={`navbar-collapse collapse ${isTopBarCollapse ? "show" : ""}`}
        id="navbarVerticalCollapse"
      >
        <div
          className={`navbar-vertical-content d-flex flex-column ${
            isSideBarCollapse ? "" : "justify-content-between"
          }`}
        >
          <ul className="navbar-nav flex-column" id="navbarVerticalNav">
            <li className="nav-item">
              <p className="navbar-vertical-label">Pages</p>
              <hr className="navbar-vertical-line" />
              <div className="nav-item-wrapper">
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) => {
                    return `nav-link label-1 ${isActive ? "active" : ""}`;
                  }}
                  onClick={collapseAfterClick}
                >
                  <div className="d-flex align-items-center justify-items-center">
                    <span className="nav-link-icon">
                      <Icons.UDashboard width={16} heigth={16} />
                    </span>
                    <span className="nav-link-text-wrapper">
                      <span className="nav-link-text">Dashboard</span>
                    </span>
                  </div>
                </NavLink>
              </div>

              <div className="nav-item-wrapper">
                <div
                  className="nav-link dropdown-indicator label-1"
                  onClick={() => setCustOpen((prev) => !prev)}
                  style={{ userSelect: "none", cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center">
                    <div className="dropdown-indicator-icon">
                      <Icons.UCaretRight
                        width={8}
                        height={8}
                        className={`rotate-animate ${
                          isCustOpen ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                    <span className="nav-link-icon">
                      <Users size={16} />
                    </span>
                    <span className="nav-link-text">Customers</span>
                  </div>
                </div>
                <div className="parent-wrapper label-1">
                  <ul
                    className={`nav collapse parent ${
                      isCustOpen ? "show" : ""
                    }`}
                  >
                    <li className="collapsed-nav-item-title d-none">
                      Customers
                    </li>
                    <li className="nav-item">
                      <Buttons.SideNavButton
                        to="customers"
                        label="Customer List"
                      >
                        <User size={16} />
                      </Buttons.SideNavButton>
                    </li>
                    {user?.permission_id?.write ? (
                      <li className="nav-item">
                        <Buttons.SideNavButton
                          to="customers-new"
                          end
                          label="Add New Customer"
                        >
                          <UserPlus size={16} />
                        </Buttons.SideNavButton>
                      </li>
                    ) : (
                      <></>
                    )}
                  </ul>
                </div>
              </div>
              <div className="nav-item-wrapper">
                <div
                  className="nav-link dropdown-indicator label-1"
                  onClick={() => setProdOpen((prev) => !prev)}
                  style={{ userSelect: "none", cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center">
                    <div className="dropdown-indicator-icon">
                      <Icons.UCaretRight
                        width={8}
                        height={8}
                        className={`rotate-animate ${
                          isProdOpen ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                    <span className="nav-link-icon">
                      <Box size={16} />
                    </span>
                    <span className="nav-link-text">Products</span>
                  </div>
                </div>
                <div className="parent-wrapper label-1">
                  <ul
                    className={`nav collapse parent ${
                      isProdOpen ? "show" : ""
                    }`}
                    data-bs-parent="#navbarVerticalCollapse"
                    id="products"
                  >
                    <li className="collapsed-nav-item-title d-none">
                      Products
                    </li>
                    <li className="nav-item">
                      <Buttons.SideNavButton
                        to="products"
                        end
                        label="All Products"
                      >
                        <Icons.UImages width={16} height={16} />
                      </Buttons.SideNavButton>
                    </li>
                    <li className="nav-item">
                      <Buttons.SideNavButton
                        to="products/new"
                        label="New Products"
                      >
                        <Icons.UImagePlus height={16} width={16} />
                      </Buttons.SideNavButton>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="nav-item-wrapper">
                <NavLink
                  to="clusters"
                  className={({ isActive }) => {
                    return `nav-link label-1 ${isActive ? "active" : ""}`;
                  }}
                  onClick={collapseAfterClick}
                >
                  <div className="d-flex align-items-center justify-items-center">
                    <span className="nav-link-icon">
                      <Icons.FiInterests width={18} heigth={18} />
                    </span>
                    <span className="nav-link-text-wrapper">
                      <span className="nav-link-text">Cluster</span>
                    </span>
                  </div>
                </NavLink>
              </div>
            </li>
          </ul>
          {user?.permission_id?.write ? (
            <ul className="navbar-nav flex-column" id="navbarVerticalNav2">
              <li className="nav-item">
                <p className="navbar-vertical-label">Settings</p>
                <hr className="navbar-vertical-line" />
                <div className="nav-item-wrapper">
                  <div
                    className="nav-link dropdown-indicator label-1"
                    style={{ userSelect: "none", cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="dropdown-indicator-icon">
                        <Icons.UCaretRight width={8} height={8} />
                      </div>
                      <span className="nav-link-icon">
                        <Icons.FiSettings width={16} height={16} />
                      </span>
                      <span className="nav-link-text">Configurations</span>
                    </div>
                  </div>
                  <div className="parent-wrapper label-1">
                    <ul
                      className={`nav collapse parent show`}
                      data-bs-parent="#navbarVerticalCollapse"
                      id="customers"
                    >
                      <li className="collapsed-nav-item-title d-none">
                        Configurations
                      </li>
                      <li className="nav-item">
                        <Buttons.SideNavButton to="users" label="Users">
                          <Users size={16} />
                        </Buttons.SideNavButton>
                      </li>
                      <li className="nav-item">
                        <Buttons.SideNavButton
                          to="synonyms-plurals"
                          end
                          label="Synonyms & Plurals"
                        >
                          <Icons.SyncAlt height={16} width={16} />
                        </Buttons.SideNavButton>
                      </li>
                      <li className="nav-item">
                        <Buttons.SideNavButton
                          to="translations"
                          end
                          label="Translations"
                        >
                          <Icons.GTranslate width={16} height={16} />
                        </Buttons.SideNavButton>
                      </li>
                      <li className="nav-item">
                        <Buttons.SideNavButton to="tags" end label="Tags">
                          <Icons.UTagAlt width={16} height={16} />
                        </Buttons.SideNavButton>
                      </li>
                      <li className="nav-item">
                        <Buttons.SideNavButton
                          to="categories"
                          end
                          label="Categories"
                        >
                          <Icons.UCategories width={16} height={16} />
                        </Buttons.SideNavButton>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div
        className="navbar-vertical-footer"
        onClick={() => setSideBarCollapse(!isSideBarCollapse)}
      >
        <button className="btn navbar-vertical-toggle border-0 fw-semi-bold w-100 white-space-nowrap d-flex align-items-center">
          <span className="uil uil-left-arrow-to-left fs-0"></span>
          <span className="uil uil-arrow-from-right fs-0"></span>
          <span className="navbar-vertical-footer-text ms-2">
            Collapsed View
          </span>
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
