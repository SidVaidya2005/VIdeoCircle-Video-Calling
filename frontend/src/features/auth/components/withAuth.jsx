import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { storage } from "../../../shared/lib/storage";

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const router = useNavigate();
        const { verifyToken } = useContext(AuthContext);
        const [checking, setChecking] = useState(true);

        useEffect(() => {
            const token = storage.getToken();
            if (!token) {
                router("/auth");
                return;
            }
            verifyToken().then((valid) => {
                if (!valid) {
                    storage.clearToken();
                    router("/auth");
                } else {
                    setChecking(false);
                }
            });
        }, []) // eslint-disable-line react-hooks/exhaustive-deps

        if (checking) return null;
        return <WrappedComponent {...props} />
    }

    return AuthComponent;
}

export default withAuth;
