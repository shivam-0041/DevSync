import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../components/contexts/auth-context";

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { user } = useContext(AuthContext);

    return user ? <>{children}</> : <Navigate to="/login" replace />;
}

export default PrivateRoute;