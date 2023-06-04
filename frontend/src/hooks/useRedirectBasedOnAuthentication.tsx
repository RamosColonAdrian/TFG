import { authContext } from "../contexts/authContext/authContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Auth = "authenticated" | "unauthenticated";

export default function useRedirectBasedOnAuthentication(auth: Auth) {
  const { authenticated, loading } = useContext(authContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (auth === "authenticated" && !authenticated) {
      navigate("/login");
    }
    if (auth === "unauthenticated" && authenticated) {
      navigate("/users");
    }
  }, [authenticated, auth, history]);
}
