import { useNavigate } from "@tanstack/react-router";
import { useSelector } from "react-redux";
const Protected = ({ children, roles }) => {
    const navigate = useNavigate();
    const { token, user } = useSelector((state) => state.auth);
    if (token && user && roles.length > 0) {
        const isCanAccess = roles.includes(user?.role);
        if (!isCanAccess) {
            navigate({ to: "/" });
            return;
        }
    }
    return children;
};
export default Protected;