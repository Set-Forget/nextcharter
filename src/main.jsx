import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import AuthContextProvider from "./context/AuthProvider";
import "./index.css";
import RootRoutes from "./routes";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthContextProvider>
            <RouterProvider router={RootRoutes} />
        </AuthContextProvider>
    </React.StrictMode>
);
