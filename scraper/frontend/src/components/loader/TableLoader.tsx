function TableLoader() {
  return (
    <>
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-10 col-sm-6 col-lg-4">
          <p className="placeholder-wave">
            <span
              className="placeholder col-10 rounded-2"
              style={{ height: "40px" }}
            ></span>
          </p>
        </div>
      </div>
      <div className="mx-n4 mx-lg-n6 px-4 px-lg-6 mb-9 bg-white border-y border-300 mt-2 position-relative top-1">
        <div className="min-vh-70">
          <table className="table fs--1 mb-0">
            <thead>
              <tr>
                <th>
                  <p className="placeholder-wave">
                    <span
                      className="placeholder col-10 rounded-2"
                      style={{ height: "20px" }}
                    ></span>
                  </p>
                </th>
                <th>
                  <p className="placeholder-wave">
                    <span
                      className="placeholder col-10 rounded-2"
                      style={{ height: "20px" }}
                    ></span>
                  </p>
                </th>
                <th>
                  <p className="placeholder-wave">
                    <span
                      className="placeholder col-10 rounded-2"
                      style={{ height: "20px" }}
                    ></span>
                  </p>
                </th>
                <th>
                  <p className="placeholder-wave">
                    <span
                      className="placeholder col-10 rounded-2"
                      style={{ height: "20px" }}
                    ></span>
                  </p>
                </th>
                <th>
                  <p className="placeholder-wave">
                    <span
                      className="placeholder col-10 rounded-2"
                      style={{ height: "20px" }}
                    ></span>
                  </p>
                </th>
                <th>
                  <p className="placeholder-wave">
                    <span
                      className="placeholder col-10 rounded-2"
                      style={{ height: "20px" }}
                    ></span>
                  </p>
                </th>
              </tr>
            </thead>
            <tbody className="list" id="products-table-body">
              {[...Array(5)].map((_, index) => (
                <tr
                  key={index}
                  className="hover-actions-trigger btn-reveal-trigger position-static"
                >
                  <th>
                    <p className="placeholder-wave">
                      <span
                        className="placeholder col-10 rounded-2"
                        style={{ height: "40px" }}
                      ></span>
                    </p>
                  </th>
                  <th>
                    <p className="placeholder-wave">
                      <span
                        className="placeholder col-10 rounded-2"
                        style={{ height: "40px" }}
                      ></span>
                    </p>
                  </th>
                  <th>
                    <p className="placeholder-wave">
                      <span
                        className="placeholder col-10 rounded-2"
                        style={{ height: "40px" }}
                      ></span>
                    </p>
                  </th>
                  <th>
                    <p className="placeholder-wave">
                      <span
                        className="placeholder col-10 rounded-2"
                        style={{ height: "40px" }}
                      ></span>
                    </p>
                  </th>
                  <th>
                    <p className="placeholder-wave">
                      <span
                        className="placeholder col-10 rounded-2"
                        style={{ height: "40px" }}
                      ></span>
                    </p>
                  </th>
                  <th>
                    <p className="placeholder-wave">
                      <span
                        className="placeholder col-10 rounded-2"
                        style={{ height: "40px" }}
                      ></span>
                    </p>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default TableLoader;
