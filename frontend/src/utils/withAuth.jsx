import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const router = useNavigate();
        const { verifyToken } = useContext(AuthContext);
        const [checking, setChecking] = useState(true);

        useEffect(() => {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth");
                return;
            }
            verifyToken().then((valid) => {
                if (!valid) {
                    localStorage.removeItem("token");
                    router("/auth");
                } else {
                    setChecking(false);
                }
            });
        }, [])

        if (checking) return null;
        return <WrappedComponent {...props} />
    }

    return AuthComponent;
}

export default withAuth;
