import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Protected = ({ children, roles }) => {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  console.log(user);
  console.log(roles);

  // Ref untuk menandai apakah redirect sudah terjadi
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;

    if (!token || !user) {
      toast.info("Anda perlu login sebelum melakukan booking.");
      navigate({ to: "/login" });
      hasRedirected.current = true;
    } else if (roles.length > 0 && !roles.includes(user?.role)) {
      toast.error("Anda tidak memiliki izin untuk mengakses halaman ini.");
      navigate({ to: "/" });
      hasRedirected.current = true;
    }
  }, [token, user, roles, navigate]);

  if (!token || (roles.length > 0 && !roles.includes(user?.role))) {
    return null;
  }

  return children;
};

export default Protected;
