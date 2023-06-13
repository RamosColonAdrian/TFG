// Hook que redireciona o usuário para a página de login ou para a página de usuários dependendo si está autenticado o no 
import { authContext } from "../contexts/authContext/authContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Auth = "authenticated" | "unauthenticated";


export default function useRedirectBasedOnAuthentication(auth: Auth) {
  // Se obtiene la información de autenticación del contexto de autenticación
  const { authenticated, loading } = useContext(authContext);
  const navigate = useNavigate();

  
  useEffect(() => {
    // Si se está cargando la información del usuario, no se hace nada
    if (loading) return;

    // Si se está autenticado y se quiere redireccionar a la página de login, se redirecciona a la página de usuarios
    if (auth === "authenticated" && !authenticated) {
      navigate("/login");
    }

    // Si no se está autenticado y se quiere redireccionar a la página de usuarios, se redirecciona a la página de login
    if (auth === "unauthenticated" && authenticated) {
      navigate("/users");
    }
  }, [authenticated, auth, history]);
}
