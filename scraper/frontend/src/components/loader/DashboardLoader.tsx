function DashboardLoader() {
  return (
    <div className="main">
      <div className="navbar navbar-vertical navbar-expand-lg"></div>
      <div className="navbar navbar-top fixed-top navbar-expand"></div>
      <div className="content">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <div
            className="spinner-border"
            style={{ width: "4rem", height: "4rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLoader;
