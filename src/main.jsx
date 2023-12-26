import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import AuthContextProvider from "./context/AuthProvider";
import RootRoutes from "./routes";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={RootRoutes} />
    </AuthContextProvider>
  </React.StrictMode>
);
