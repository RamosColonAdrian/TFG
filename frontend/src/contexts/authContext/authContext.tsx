// Archivo que contiene el contexto de autenticación de la aplicación 
import { createContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { RegisterDTO } from "../../App";
import { useNavigate } from "react-router-dom";

// Interfaz que define la información del usuario
export type UserInfo = {
  id: string;
  dni: string;
  name: string;
  surname: string;
  birthDate: string;
  registerDate: string;
  address: string;
  email: string;
  phone: string;
  relativeName: string;
  relativePhone: string;
  role: string;
  type: string;
  picture: string;
  departmentId: string;
  updatedAt: string;
  createdAt: string;
};

// Interfaz que define el contexto de autenticación
type AuthContextType = {
  loading: boolean;
  authenticated: boolean;
  userInfo: UserInfo;
  login: (email: string, password: string, token?: string) => Promise<void>;
  register: (dto: RegisterDTO) => Promise<void>;
  logout: () => void;
};

// Creación del contexto de autenticación
export const authContext = createContext<AuthContextType>(
  {} as AuthContextType
);

// Componente que provee el contexto de autenticación
export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  // Estados del contexto de autenticación 
  const [authenticated, setAuthenticated] = useState<AuthContextType["authenticated"]>(false);
  const [userInfo, setUserInfo] = useState<AuthContextType["userInfo"]>(
    {} as AuthContextType["userInfo"]
  );
  const navigate = useNavigate();

  // Estado que indica si se está cargando la información del usuario
  const [loading, setLoading] = useState(true);

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token, se termina la carga
    if (!token) {
      setLoading(false);
      return;
    }

    // Se obtiene la información del usuario
    login("", "", token);
  }, []);

  // Función que realiza el login
  const login = async (email: string, password: string, token?: string) => {
    // Se realiza la petición al backend
    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/auth/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    // Se obtiene el token y la información del usuario
    const { token: returnedToken, user } = data;

    // Se almacena el token y la información del usuario en el local storage
    localStorage.setItem("token", returnedToken);
    setUserInfo(user);
    setAuthenticated(true);
    setLoading(false);
  };

  // Función que realiza el registro
  const register = async ({ email, name, password, surname }: RegisterDTO) => {
    // Se realiza la petición al backend 
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/auth/register`,
      { email, password, name, surname },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    navigate("/login");
  };

  // Función que realiza el logout
  const logout = () => {
    // Se elimina el token y la información del usuario del local storage 
    localStorage.removeItem("token");
    setAuthenticated(false);
    setUserInfo({} as AuthContextType["userInfo"]);
  };

  // Se retorna el contexto de autenticación 
  return (
    <authContext.Provider
      value={{
        loading,
        authenticated,
        userInfo,
        login,
        register,
        logout,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
