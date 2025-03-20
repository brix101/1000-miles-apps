import AvatarContainer from "@/components/container/avatar-container";
import PageHeaderContainer from "@/components/container/page-header-Container";
import { ModuleSelect } from "@/components/custom-select/module-select";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useUserAddMutation from "@/hooks/mutations/useUserAddMutation";
import useRandomString from "@/hooks/useRandomString";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserDTO, createUserBody } from "@repo/schema";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";

function UserAdd() {
  const { randString, getRandString } = useRandomString(8);

  const form = useForm<CreateUserDTO>({
    resolver: zodResolver(createUserBody),
    defaultValues: {
      name: "",
      email: "",
      password: randString,
      isSuperAdmin: false,
      allowedModules: [],
    },
  });

  const { mutate, isPending } = useUserAddMutation(form);

  function onSubmit(data: CreateUserDTO) {
    mutate(data);
  }

  return (
    <>
      <PageHeaderContainer>Settings - Users</PageHeaderContainer>
      <div id="user">
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <Button size="sm" onClick={form.handleSubmit(onSubmit)}>
            {isPending ? (
              <span className="spinner-border spinner-border-xs"></span>
            ) : null}
            Save
          </Button>
          <NavLink
            type="button"
            className="btn btn-outline-secondary btn-sm"
            to="/dashboard/settings/users"
          >
            Cancel
          </NavLink>
        </div>
        <Form {...form}>
          <div className="mt-5">
            <div className="row mb-2 col-6 d-flex justify-content-center p-2">
              <div className="avatar avatar-5xl avatar-bordered me-4">
                <AvatarContainer name={form.watch("name")} />
              </div>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState: { error } }) => (
                <div className="row">
                  <label className="col-sm-2 col-form-label">Name</label>
                  <div className="col-sm-4">
                    <Input placeholder="John doe" error={error} {...field} />
                    <FormMessage />
                  </div>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState: { error } }) => (
                <div className="row">
                  <label className="col-sm-2 col-form-label">Email</label>
                  <div className="col-sm-4">
                    <Input
                      placeholder="john.doe@example.com"
                      type="email"
                      error={error}
                      {...field}
                    />
                    <FormMessage />
                  </div>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState: { error } }) => (
                <div className="row">
                  <label className="col-sm-2 col-form-label">Password</label>
                  <div
                    className="col-sm-4 d-flex align-items-center"
                    style={{ gap: "5px" }}
                  >
                    <div className="w-100">
                      <Input placeholder="password" error={error} {...field} />
                      <FormMessage />
                    </div>
                    <Button
                      type="button"
                      variant="success"
                      size="icon"
                      onClick={() => {
                        const newSTring = getRandString();
                        field.onChange(newSTring);
                      }}
                    >
                      <Icons.LuDices />
                    </Button>
                  </div>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="isSuperAdmin"
              render={({ field: { value, ...field } }) => (
                <div className="row d-flex align-items-center">
                  <label className="col-sm-2 col-form-label">Super Admin</label>
                  <div className="col-sm-4">
                    <input type="checkbox" checked={value} {...field} />
                    <FormMessage />
                  </div>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="allowedModules"
              render={({ field: { value, onChange } }) => (
                <div className="row">
                  <label className="col-sm-2 col-form-label">Modules</label>
                  <div className="col-sm-4">
                    <ModuleSelect
                      value={value}
                      onChange={(e) => onChange(e.map((item) => item.value))}
                    />
                    <FormMessage />
                  </div>
                </div>
              )}
            />
          </div>
        </Form>
      </div>
    </>
  );
}

export default UserAdd;
