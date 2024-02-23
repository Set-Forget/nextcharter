import { createHashRouter, createRoutesFromElements, Route } from "react-router-dom";
import Dialog from "../components/Dialog.jsx";
import Modal from "../components/Modal.jsx";
import ProtectedRoute from "../components/ProtectedRoutes.jsx";
import Toast from "../components/Toast.jsx";
import AuthGuard from "../guards/AuthGuard.jsx";
import StudentProgress from "../pages/dashboard/StudentProgress.jsx";
import EditCompetencies from "../pages/EditCompetencies.jsx";
import EmailVerification from "../pages/EmailVerification.jsx";
import Home from "../pages/home/Home.jsx";
import Login from "../pages/Login.jsx";
import Profile from "../pages/Profile.jsx";
import Projects from "../pages/projects/Projects.jsx";
import Registers from "../pages/registers/Registers.jsx";
import SignUp from "../pages/SignUp.jsx";
import PasswordReset from "../pages/PasswordReset.jsx";

const RootRoutes = createHashRouter(
    createRoutesFromElements(
        <>
            <Route
                path="/login"
                element={
                    <>
                        <Login />
                        <Toast />
                    </>
                }
            />
            <Route
                path="/signup"
                element={
                    <>
                        <SignUp />
                        <Toast />
                    </>
                }
            />
            <Route path="*" element={<AuthGuard />}>
                <Route
                    index
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <Home />
                            <Dialog />
                            <Modal />
                            <Toast />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="registrations"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "teacher"]}>
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
                            <Toast />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="editCompetencies"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <EditCompetencies />
                            <Toast />
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
                            <Toast />
                        </ProtectedRoute>
                    }
                />
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
            <Route path="email-verification" element={<EmailVerification />} />
            <Route
                path="passwordReset"
                element={
                    <>
                        <PasswordReset /> <Toast />
                    </>
                }
            />
        </>
    )
);

export default RootRoutes;
