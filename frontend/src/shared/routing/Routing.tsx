// Archivo que contiene el contexto de autenticación de la aplicación 
import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";
import { authContext } from "../../contexts/authContext/authContext";
import VideoPlayer from "../../pages/VideoPlayer/VideoPlayer";
import UserList from "../../pages/UserList/UserList";
import UserDetail from "../../pages/UserDetails/UserDetail";
import ZonesList from "../../pages/ZoneList/ZonesList";
import ZoneDetails from "../../pages/ZoneDetails/ZoneDetails";
import AddZone from "../../pages/AddZone/AddZone";
import DepartamentList from "../../pages/DepartmentsList/DepartmentList";
import AddDepartment from "../../pages/AddDepartment/AddDepartment";
import DepartamentDetails from "../../pages/DepartmentDetails/DepartmentDetails";
import AccessLogList from "../../pages/AccessLog/AcessLogList";

type Props = {};

function Routing({}: Props) {
  const { authenticated } = useContext(authContext);

  return (
    <Routes>
      {/*  loggeado */}
      <Route path="/user/:userId" element={<UserDetail />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/zone/add" element={<AddZone />} />
      <Route path="/zone/:zoneId" element={<ZoneDetails />} />
      <Route path="/departments" element={<DepartamentList />} />
      <Route path="/department/add" element={<AddDepartment />} />
      <Route path="/department/:departId" element={<DepartamentDetails />} />
      <Route path="/register" element={<Register />} />
      <Route path="/zones" element={<ZonesList />} />
      <Route path="/access" element={<AccessLogList />} />
      {/* no loggeado */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/video/:zoneId" element={<VideoPlayer />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default Routing;
