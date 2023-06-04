import { createContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { RegisterDTO } from "../../App";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  authenticated: boolean;
  userInfo: {
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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    login("", "", token);
  }, []);

  const login = async (email: string, password: string, token?: string) => {
    const { data } = await axios.post(
      "http://localhost:8007/login",
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
  };

  const register = async ({ email, name, password, surname }: RegisterDTO) => {
    await axios.post(
      "http://localhost:8007/register",
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
