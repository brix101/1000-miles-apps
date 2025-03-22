import illustration500 from "@/assets/img/spot-illustrations/500-illustration.png";
import img500 from "@/assets/img/spot-illustrations/500.png";
import illustrationDark500 from "@/assets/img/spot-illustrations/dark_500-illustration.png";
import imgDark500 from "@/assets/img/spot-illustrations/dark_500.png";
import { AxiosError } from "axios";
import { useNavigate, useRouteError } from "react-router-dom";

function Page500() {
  const navigate = useNavigate();
  const error = useRouteError() as AxiosError;

  console.log({ page500: error });
  function refreshClick() {
    navigate(0);
  }

  return (
    <div className="px-3">
      <div className="row min-vh-100 flex-center p-5">
        <div className="col-12 col-xl-10 col-xxl-8">
          <div className="row justify-content-center g-5">
            <div className="col-12 col-lg-6 text-center order-lg-1">
              <img
                className="img-fluid w-lg-100 d-light-none"
                src={illustration500}
                alt="Illustration500"
                width="400"
              />
              <img
                className="img-fluid w-md-50 w-lg-100 d-dark-none"
                src={illustrationDark500}
                alt="IllustrationDark500"
                width="540"
              />
            </div>
            <div className="col-12 col-lg-6 text-center text-lg-start">
              <img
                className="img-fluid mb-6 w-50 w-lg-75 d-dark-none"
                src={img500}
                alt="Img500"
              />
              <img
                className="img-fluid mb-6 w-50 w-lg-75 d-light-none"
                src={imgDark500}
                alt="ImgDark500"
              />
              <h2 className="text-800 fw-bolder mb-3">
                {error?.message ?? "Network Error"}!
              </h2>
              <p className="text-900 mb-5">
                But relax! Our cat is here to play you some music.
              </p>
              <button className="btn btn-lg btn-primary" onClick={refreshClick}>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page500;
