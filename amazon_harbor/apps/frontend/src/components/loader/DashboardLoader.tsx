function DashboardLoader() {
  return (
    <div className=" vh-100">
      <div className="card-text placeholder-glow">
        <h2 className="placeholder col-6 mb-5 rounded-2"></h2>
      </div>
      <div className="d-flex justify-content-center vh-50 align-items-center">
        <div
          className="spinner-border"
          role="status"
          style={{ height: "10rem", width: "10rem" }}
        ></div>
      </div>
    </div>
  );
}

export default DashboardLoader;
