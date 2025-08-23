import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OAuth2Success() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        if (token) {
            AsyncStorage.setItem("jwt", token).then(() => {
                navigate("/profile");
            });
        }
    }, [navigate]);

    return <p>로그인 처리 중...</p>;
}
