import { createBrowserRouter } from "react-router-dom";

import MonitorPage from "./monitor/MonitorPage";
import LoginPage from "./auth/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "monitor",
    element: <MonitorPage />,
  },
]);

export default router;
