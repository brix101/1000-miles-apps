import router from "@/pages";
import { useBoundStore } from "@/store";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import "@/assets/css/theme.min.css";
// Include only the reset
import "@/assets/css/style.css";
import "instantsearch.css/themes/reset.css";
// or include the full Satellite theme
import "instantsearch.css/themes/satellite.css";
import LoadingContent from "./components/loader/LoadingContent";

function App() {
  const {
    ui: { isSideBarCollapse },
  } = useBoundStore();

  useEffect(() => {
    if (isSideBarCollapse) {
      document.body.classList.add("navbar-vertical-collapsed");
    } else {
      document.body.classList.remove("navbar-vertical-collapsed");
    }
  }, [isSideBarCollapse]);

  return (
    <RouterProvider router={router} fallbackElement={<LoadingContent />} />
  );
}

export default App;
