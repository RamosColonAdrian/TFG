import { createContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { RegisterDTO } from "../../App";
import { useNavigate } from "react-router-dom";

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

type AuthContextType = {
  loading: boolean;
  authenticated: boolean;
  userInfo: UserInfo;
  login: (email: string, password: string, token?: string) => Promise<void>;
  register: (dto: RegisterDTO) => Promise<void>;
  logout: () => void;
};

export const authContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] =
    useState<AuthContextType["authenticated"]>(false);
  const [userInfo, setUserInfo] = useState<AuthContextType["userInfo"]>(
    {} as AuthContextType["userInfo"]
  );
  const navigate = useNavigate();
    
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    login("", "", token);
  }, []);

  const login = async (email: string, password: string, token?: string) => {


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

    const { token: returnedToken, user } = data;

    localStorage.setItem("token", returnedToken);
    setUserInfo(user);
    setAuthenticated(true);
    setLoading(false);
  };

  const register = async ({ email, name, password, surname }: RegisterDTO) => {
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

  const logout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setUserInfo({} as AuthContextType["userInfo"]);
  };

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
