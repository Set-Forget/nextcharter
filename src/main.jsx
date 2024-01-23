import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import AuthContextProvider from "./context/AuthProvider";
import RootRoutes from "./routes";
import "./index.css";
import Modal from "./components/ModalV2";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthContextProvider>
            <RouterProvider router={RootRoutes} />
            <Modal />
        </AuthContextProvider>
    </React.StrictMode>
);
