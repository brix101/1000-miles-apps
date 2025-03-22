import { Icons } from "@/assets/icons";
import { Inputs } from "@/components/inputs";
import Page500 from "@/pages/Page500";
import {
  SignInInput,
  signInResponseSchema,
  signInSchema,
} from "@/schema/auth.schema";
import { signInUserMutation } from "@/services/auth.service";
import { useBoundStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type SignInError = {
  data: {
    detail: string;
  };
};

function SignInForm() {
  const { setAuthTokenUser } = useBoundStore();
  const navigate = useNavigate();

  const { handleSubmit, setError, control } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const { mutate, isLoading, error } = useMutation({
    mutationFn: signInUserMutation,
    onSuccess: (response) => {
      const parsedResponse = signInResponseSchema.parse(response.data);
      setAuthTokenUser(parsedResponse);
      navigate(0);
    },
    onError: (error: AxiosError) => {
      if (error?.response?.status === 400) {
        const signInError = error.response as SignInError;
        setError(
          "email",
          { message: signInError.data.detail },
          { shouldFocus: true }
        );
        setError("password", { message: "" });
      }
    },
  });

  if (error && error.code?.includes("ERR_NETWORK")) {
    return <Page500 />;
  }

  function onSubmit(values: SignInInput) {
    mutate(values);
  }

  return (
    <form
      className="auth-form-box needs-validation"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="text-center mt-10 my-7">
        <h3 className="text-1000">Sign In</h3>
        <p className="text-700">Get access to your account</p>
      </div>

      <div className="mb-3">
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <Inputs.Primary
              label="Email address"
              placeholder="john.doe@example.com"
              type="text"
              leftIcon={
                <Icons.UUser
                  className="text-900 fs--1 form-icon"
                  width={14}
                  height={14}
                />
              }
              error={error}
              {...field}
            />
          )}
        />
      </div>
      <div className="mb-3">
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <Inputs.Password
              label="Password"
              placeholder="password"
              error={error}
              {...field}
            />
          )}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100 mt-7 mb-10"
        disabled={isLoading}
      >
        {isLoading ? (
          <span
            className="spinner-border spinner-border-sm"
            style={{ height: 16, width: 16 }}
          ></span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}

export default SignInForm;
