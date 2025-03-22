import { Icons } from "@/assets/icons";
import UserImageContainer from "@/components/container/UserImageContainer";
import { Inputs } from "@/components/inputs";
import LoadingContent from "@/components/loader/LoadingContent";
import { QUERY_USERS_KEY, QUERY_USER_KEY } from "@/constant/query.constant";
import { ResponseError } from "@/schema/error.schema";
import {
  UpdateUserInput,
  UsersEntity,
  updateUserSchema,
  userSchema,
} from "@/schema/user.schema";
import { useQueryPermissions } from "@/services/permission.service";
import { useQueryRoles } from "@/services/role.service";
import { updateUserMutation, useQueryUser } from "@/services/user.service";
import { useBoundStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function User() {
  const userParams = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    auth: { user: authUser },
    setAuthUser,
  } = useBoundStore();

  const { data: permissionsData, isLoading: isPermissionsLoading } =
    useQueryPermissions();
  const { data: rolesData, isLoading: isRolesLoading } = useQueryRoles();

  const userId = (userParams?.userId as string) ?? "";
  const viewType = (userParams?.viewType as string) ?? "";
  const isView = viewType.toLowerCase() === "view";

  const {
    data: userData,
    isLoading: isUserLoading,
    error,
  } = useQueryUser(userId);

  const {
    handleSubmit,
    reset,
    setError,
    control,
    resetField,
    formState: { isDirty },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      password: undefined,
    },
  });

  useEffect(() => {
    if (userData) {
      reset({
        id: userData.id,
        active: userData?.active,
        email: userData?.email,
        name: userData?.name,
        status: userData?.status,
        permission_id: userData?.permission_id?.id,
        role_id: userData?.role_id?.id,
      });
    }
  }, [userData, reset]);

  const { mutate, isLoading: isUpdateLoading } = useMutation({
    mutationFn: updateUserMutation,
    onSuccess: (response) => {
      const user = userSchema.parse(response.data);
      queryClient.setQueryData([QUERY_USER_KEY, userId], { ...user });
      queryClient.setQueriesData([QUERY_USERS_KEY], (prev: unknown) => {
        const { users } = prev as UsersEntity;
        const upatedUsers = users.map((item) => {
          if (item.id === user.id) {
            return user;
          }
          return item;
        });

        return { users: upatedUsers };
      });

      if (authUser?.id === user.id) {
        setAuthUser(user);
      }
      toast.success("User Updated");
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

  function onSubmit(values: UpdateUserInput) {
    mutate(values);
  }

  if (isUserLoading) {
    return <LoadingContent />;
  }

  if (error) {
    navigate("/dashboard/users");
  }

  return (
    <>
      <div className="mx-n4 mx-lg-n6 px-6 position-relative">
        <nav className="mb-2" aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="#!"></a>
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
            <li className="breadcrumb-item active">{userData?.name}</li>
          </ol>
        </nav>

        <div className="g-2 mb-4">
          <div className="col-auto">
            <h3 className="mb-0">{userData?.name}</h3>
          </div>
        </div>

        <form className="row g-6 mb-2" onSubmit={handleSubmit(onSubmit)}>
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
                              setSelectedFile={(e) => {
                                if (e) {
                                  onChange(e);
                                } else {
                                  resetField("file");
                                }
                              }}
                              image_url={userData?.image_url}
                              disabled={isView}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12 col-xl-8">
                        <div className="mb-2">
                          <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <Inputs.Primary
                                label="Name"
                                placeholder="name"
                                type="text"
                                disabled={isView}
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
              <div className="col-12 col-xl-12">
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
                            disabled={isView}
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
                    <div className="text-start mb-3">
                      <Controller
                        name="permission_id"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <Inputs.Select
                            label="Permission"
                            placeholder="Select permission"
                            isLoading={isPermissionsLoading}
                            disabled={isView}
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
                    <div className="row flex-between-center">
                      <div className="g-2 me-4 my-2">
                        <h5 className="mb-0">Login Details</h5>
                      </div>
                    </div>
                    <div className="mb-3">
                      <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <Inputs.Primary
                            label="Email address"
                            placeholder="john.doe@example.com"
                            type="text"
                            disabled={isView}
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
                    <div
                      className={`mb-3 text-start ${isView ? "d-none" : ""}`}
                    >
                      <Controller
                        name="password"
                        control={control}
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
                  </div>
                </div>
              </div>
            </div>
            {!isView ? (
              <div className="col-12 d-flex justify-content-end py-4">
                <button
                  className="btn btn-danger me-2 mb-2 mb-sm-0"
                  type="button"
                  onClick={() => {
                    isDirty
                      ? reset({
                          id: userData?.id,
                          active: userData?.active,
                          email: userData?.email,
                          name: userData?.name,
                          status: userData?.status,
                          permission_id: userData?.permission_id?.id,
                          role_id: userData?.role_id?.id,
                        })
                      : navigate("/dashboard/users");
                  }}
                  disabled={isUpdateLoading}
                >
                  {isDirty ? "Discard" : "Cancel"}
                </button>
                <button
                  className="btn btn-primary mb-2 mb-sm-0"
                  disabled={isUpdateLoading || !isDirty}
                >
                  Update
                  {isUpdateLoading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{ height: 16, width: 16 }}
                    ></span>
                  ) : (
                    <Icons.FiChevronRight height={16} width={16} />
                  )}
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default User;
