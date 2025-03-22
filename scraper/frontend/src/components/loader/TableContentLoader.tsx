import TableLoader from "./TableLoader";

function TableContentLoader() {
  return (
    <>
      <div className="g-2 mb-4">
        <div className="col-2">
          <h2 className="mb-0">
            <p className="placeholder-wave">
              <span
                className="placeholder col-12 rounded-2"
                style={{ height: "30px" }}
              ></span>
            </p>
          </h2>
        </div>
      </div>
      <TableLoader />
    </>
  );
}

export default TableContentLoader;
