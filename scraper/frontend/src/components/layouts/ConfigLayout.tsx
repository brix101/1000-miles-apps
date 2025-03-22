import Page404 from "@/pages/Page404";
import { useBoundStore } from "@/store";
import { Outlet } from "react-router-dom";

function ConfigLayout() {
  const {
    auth: { user },
  } = useBoundStore();

  if (!user?.permission_id?.write) {
    return <Page404 />;
  }

  return <Outlet />;
}

export default ConfigLayout;
