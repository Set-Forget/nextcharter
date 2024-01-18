import { createHashRouter, createRoutesFromElements, Route } from "react-router-dom";

import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import TableView from "../pages/TableView.jsx";
import Layout from "../pages/Layout.jsx";
import StudentProgress from "../pages/StudentProgress.jsx";
import Profile from "../pages/Profile.jsx";
import EditCompetencies from "../pages/EditCompetencies.jsx";
import LoginSuccess from "../pages/LoginSuccess.jsx";
import Projects from "../pages/Projects.jsx";

const RootRoutes = createHashRouter(
    createRoutesFromElements(
        <>
            <Route path="/login" element={<Login />} />
            <Route path="/successful" element={<LoginSuccess />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="registrations" element={<TableView />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/:id" element={<StudentProgress />} />
                <Route path="editCompentencies" element={<EditCompetencies />} />
                <Route path="projects" element={<Projects />} />
            </Route>
            <Route path="*" element={<div></div>} />
        </>
    )
);

export default RootRoutes;
