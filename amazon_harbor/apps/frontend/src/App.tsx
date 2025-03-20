import { useEffect } from "react";

import useBoundStore from "@/hooks/useBoundStore";
import { BrowserRouter } from "@/provider/RouterProvider";
import { Toaster } from "sonner";

import "@/assets/css/simplebar.min.css";

import "@/assets/css/theme.min.css";

import "@/assets/css/style.css";

import "@/assets/css/custom.css";
import ModalPortal from "./components/modal-portal";

function App() {
  const {
    ui: { isSideBarCollapse },
  } = useBoundStore();

  useEffect(() => {
    const bodyClassList = document.body.classList;
    bodyClassList.toggle("navbar-vertical-collapsed", isSideBarCollapse);
  }, [isSideBarCollapse]);

  return (
    <>
      <BrowserRouter />
      <ModalPortal />
      <div>
        <Toaster richColors closeButton />
      </div>
    </>
  );
}

export default App;
