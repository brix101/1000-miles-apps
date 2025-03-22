function LoadingContent() {
  return (
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
  );
}

export default LoadingContent;
