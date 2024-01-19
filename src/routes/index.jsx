import {
  createHashRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import TableView from "../pages/TableView.jsx";
import Layout from "../pages/Layout.jsx";
import StudentProgress from "../pages/StudentProgress.jsx";
import Profile from "../pages/Profile.jsx";
import EditCompetencies from "../pages/EditCompetencies.jsx";
import LoginSuccess from "../pages/LoginSuccess.jsx";
import SignUp from "../pages/SignUp.jsx";
import ProtectedRoute from "../components/ProtectedRoutes.jsx";
import Projects from "../pages/Projects.jsx";

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
            </ProtectedRoute>
          }
        />
        <Route
          path="registrations"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <TableView />
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
        <Route path="projects" element={<Projects />} />
      </Route>
      <Route path="*" element={<div>404 Not Found</div>} />
    </>
  )
);

export default RootRoutes;
