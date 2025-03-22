import { SignInInput } from "@/schema/auth.schema";
import { v1ApiClient } from "@/utils/httpCommon";

function signInUserMutation({ email, password }: SignInInput) {
  return v1ApiClient.post(
    "/auth/login",
    JSON.stringify({ email: email, password: password }),
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
}

export { signInUserMutation };
