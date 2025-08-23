import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/login/Login";
import OAuth2Success from "./components/login/OAuth2Success";
import ProfileScreen from "./components/login/ProfileScreen";

function WebApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/oauth2/success" element={<OAuth2Success />} />
                <Route path="/profile" element={<ProfileScreen />} />
            </Routes>
        </BrowserRouter>
    );
}

const root = createRoot(document.getElementById("root"));
root.render(<WebApp />);
