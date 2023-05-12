import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";
import { authContext } from "../../contexts/authContext/authContext";
import UserInfo from "../../pages/UserInfo/UserInfo";
import VideoPlayer from "../../pages/VideoPlayer/VideoPlayer";

type Props = {};

function RedirectToRegister() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/register");
    }, [])

    return null
}

function RedirectToUserInfo() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/user-info");
    }, [])

    return null
}

function Routing({ }: Props) {
    const { authenticated } = useContext(authContext);

    return (

        <Routes>
            {authenticated ?
                <>
                    <Route path="/user-info" element={<UserInfo />} />
                    <Route path="*" element={<RedirectToUserInfo />} />
                </>
                :
                <>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/video" element={<VideoPlayer />} />
                    <Route path="*" element={<RedirectToRegister />} />
                </>
            }
        </Routes>
    );
}

export default Routing;
