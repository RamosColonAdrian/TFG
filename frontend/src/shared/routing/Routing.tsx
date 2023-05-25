import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";
import { authContext } from "../../contexts/authContext/authContext";
import VideoPlayer from "../../pages/VideoPlayer/VideoPlayer";
import UserList from "../../pages/UserList/UserList";
import UserDetail from "../../pages/UserDetails/UserDetail";
import ZonesList from "../../pages/AccessList/ZonesList";
import { Zoom } from "react-toastify";
import ZoneDetails from "../../pages/ZoneDatails/ZoneDetails";
import AddZone from "../../pages/AddZone/AddZone";

type Props = {};



function Routing({ }: Props) {
    const { authenticated } = useContext(authContext);

    return (

        <Routes>
            {authenticated ?
                <>
                    <Route path="/user/:userId" element={<UserDetail />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/zone/:zoneId" element={<ZoneDetails />} />
                    <Route path="/zone/add" element={<AddZone />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/zones" element={<ZonesList />} />


                </>
                :
                <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/video" element={<VideoPlayer />} />
                    <Route path="*" element={<Register />} />

                </>
            }
        </Routes>
    );
}

export default Routing;
