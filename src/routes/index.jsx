import { createHashRouter, createRoutesFromElements, Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoutes.jsx";
import EditCompetencies from "../pages/EditCompetencies.jsx";
import Layout from "../pages/Layout.jsx";
import Login from "../pages/Login.jsx";
import LoginSuccess from "../pages/LoginSuccess.jsx";
import Profile from "../pages/Profile.jsx";
import Projects from "../pages/projects/Projects.jsx";
import SignUp from "../pages/SignUp.jsx";
import Registers from "../pages/registers/Registers.jsx";
import Dialog from "../components/Dialog.jsx";
import Modal from "../components/Modal.jsx";
import StudentProgress from "../pages/dashboard/StudentProgress.jsx";
import Home from "../pages/home/Home.jsx";

const RootRoutes = createHashRouter(
    createRoutesFromElements(
        <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/successful" element={<LoginSuccess />} />
            <Route path="/" element={<Layout />}>
                <Route
                    index
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <Home />
                            <Dialog />
                            <Modal />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="registrations"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <Registers />
                            <Modal />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="profile"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="profile/:id"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                            <StudentProgress />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="editCompetencies"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <EditCompetencies />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="projects"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                            <Projects />
                            <Dialog />
                            <Modal />
                        </ProtectedRoute>
                    }
                />
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
        </>
    )
);

export default RootRoutes;
