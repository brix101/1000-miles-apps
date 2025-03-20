import ImageBg from "@/assets/img/bg/37.png";
import SignInForm from "@/components/forms/SignInForm";
import { QUERY_ACTIVE_USER_KEY } from "@/contant/query.contant";
import { useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

function SignIn() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData([QUERY_ACTIVE_USER_KEY]);

  if (user) {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <div className="container-fluid bg-300 dark__bg-1200">
      <div
        className="bg-holder bg-auth-card-overlay"
        style={{ backgroundImage: `url(${ImageBg})` }}
      ></div>

      <div className="row flex-center position-relative min-vh-100 g-0 py-5">
        <div className="col-12 col-xl-4 col-lg-5 col-md-6">
          <div className="card border border-200 auth-card">
            <div className="card-body pe-md-0">
              <div className="row align-items-center gx-0 gy-10">
                <div className="col mx-auto">
                  <SignInForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
