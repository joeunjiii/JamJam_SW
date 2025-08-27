import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "/service/storage";

export default function OAuth2Success() {
    const navigate = useNavigate();

    useEffect(() => {
        const qs = new URLSearchParams(window.location.search);
        const hash = new URLSearchParams((window.location.hash || "").replace(/^#/, ""));
        const access = qs.get("access_token") || hash.get("access_token");

        if (access) {
            storage.setItem("accessToken", access).then(async () => {
                const check = await storage.getItem("accessToken");
                console.log("✅ accessToken 저장 완료:", check);
                navigate("/profile");
            });
        } else {
            console.error("❌ access_token 없음 (백엔드 성공 핸들러 확인 필요)");
            navigate("/login");
        }
    }, [navigate]);

    return <p>로그인 처리 중...</p>;
}
