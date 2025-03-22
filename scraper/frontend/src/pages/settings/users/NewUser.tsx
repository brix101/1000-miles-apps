import { Icons } from "@/assets/icons";
import UserImageContainer from "@/components/container/UserImageContainer";
import { Inputs } from "@/components/inputs";
import { QUERY_USERS_KEY } from "@/constant/query.constant";
import { ResponseError } from "@/schema/error.schema";
import {
  CreateUserInput,
  UsersEntity,
  createUserSchema,
  userSchema,
} from "@/schema/user.schema";
import { useQueryPermissions } from "@/services/permission.service";
import { useQueryRoles } from "@/services/role.service";
import { createUserMutation } from "@/services/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function NewUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    handleSubmit,
    setError,
    reset,
    control,
    formState: { isDirty },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {},
  });

  const { data: permissionsData, isLoading: isPermissionsLoading } =
    useQueryPermissions();
  const { data: rolesData, isLoading: isRolesLoading } = useQueryRoles();

  const { mutate, isLoading } = useMutation({
    mutationFn: createUserMutation,
    onSuccess: (response) => {
      const user = userSchema.parse(response.data);
      queryClient.setQueriesData([QUERY_USERS_KEY], (prev: unknown) => {
        const { users } = prev as UsersEntity;
        return { users: [...users, user] };
      });

      toast.success("User Added");
      reset();
    },
    onError: ({ response }: AxiosError) => {
      if (response) {
        const responseError = response as ResponseError;
        setError(
          "email",
          { message: responseError.data.detail },
          { shouldFocus: true }
        );
      }
    },
  });

  function onSubmit(values: CreateUserInput) {
    mutate(values);
  }
  return (
    <>
      <div className="mx-n4 mx-lg-n6 px-lg-6 position-relative">
        <nav className="mb-2" aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <NavLink
                to="/dashboard/users"
                end
                className={({ isActive, isPending }) => {
                  return isActive ? "active" : isPending ? "pending" : "";
                }}
              >
                All Users
              </NavLink>
            </li>
            <li className="breadcrumb-item active">New User</li>
          </ol>
        </nav>

        <div className="g-2 mb-4">
          <div className="col-auto">
            <h3 className="mb-0">Add New User</h3>
          </div>
        </div>

        <form className="row g-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-12 col-xl-auto">
            <div className="row g-2">
              <div className="col-12 col-xl-12">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12 col-xl-4 d-flex justify-content-center">
                        <Controller
                          name="file"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <UserImageContainer
                              selectedFile={value}
                              setSelectedFile={(e) => onChange(e)}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12 col-xl-8">
                        <div className="mb-2">
                          <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            render={({ field, fieldState: { error } }) => (
                              <Inputs.Primary
                                label="Name"
                                placeholder="name"
                                type="text"
                                {...field}
                                error={error}
                              />
                            )}
                          />
                        </div>
                        <div className="text-start">
                          <h3 className="text-success">Active</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="text-start mb-3">
                      <Controller
                        name="role_id"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <Inputs.Select
                            label="Company Role"
                            placeholder="Select role"
                            isLoading={isRolesLoading}
                            {...field}
                            error={error}
                            options={rolesData?.roles.map((role) => ({
                              value: role.id as string,
                              label: role.name,
                            }))}
                          />
                        )}
                      />
                    </div>
                    <div className="mb-3">
                      <Controller
                        name="permission_id"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <Inputs.Select
                            label="Permission"
                            placeholder="Select permission"
                            isLoading={isPermissionsLoading}
                            {...field}
                            error={error}
                            options={permissionsData?.permissions.map(
                              (permission) => ({
                                value: permission.id as string,
                                label: permission.name,
                              })
                            )}
                          />
                        )}
                      />
                    </div>
                    <div className="row">
                      <div className="g-2 me-4 m-2">
                        <h5 className="mb-0">Login Details</h5>
                      </div>
                    </div>
                    <div className="mb-3 text-start">
                      <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field, fieldState: { error } }) => (
                          <Inputs.Primary
                            label="Email address"
                            placeholder="john.doe@example.com"
                            leftIcon={
                              <Icons.UUser className="text-900 fs--1 form-icon" />
                            }
                            {...field}
                            error={error}
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
                            {...field}
                            error={error}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 d-flex justify-content-end py-4">
                <button
                  className="btn btn-danger me-2 mb-2 mb-sm-0"
                  type="button"
                  onClick={() => {
                    isDirty ? reset() : navigate("/dashboard/users");
                  }}
                  disabled={isLoading}
                >
                  {isDirty ? "Discard" : "Cancel"}
                </button>
                <button className="btn btn-primary mb-2 mb-sm-0">
                  <span className="px-2">Save</span>
                  {isLoading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ height: 16, width: 16 }}
                    ></span>
                  ) : (
                    <>
                      <Icons.FiChevronRight height={16} width={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default NewUser;
