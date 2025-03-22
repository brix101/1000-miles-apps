function ScreenSizeIndicator() {
  return (
    <div className="support-chat-container show">
      <div className="p-0 border border-200 screen-indicator">
        <span className="fs-0 btn-text text-primary text-nowrap fw-black">
          <div className="d-block d-sm-none">XS</div>
          <div className="d-none d-sm-block d-md-none">SM</div>
          <div className="d-none d-md-block d-lg-none">MD</div>
          <div className="d-none d-lg-block d-xl-none">LG</div>
          <div className="d-none d-xl-block">XL</div>
        </span>
      </div>
    </div>
  );
}

export default ScreenSizeIndicator;
