import { useState, useContext } from "react";
import Input from "../../shared/components/Input/Input";

import { FiKey } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";

import background from "../../assets/login-new.jpeg";

import { toast } from "react-toastify";
import { authContext } from "../../contexts/authContext/authContext";

import { Link } from "react-router-dom";
import useRedirectBasedOnAuthentication from "../../hooks/useRedirectBasedOnAuthentication";

interface LoginProps {}

type FormState = {
  email: string;
  password: string;
};

const Login: React.FC<LoginProps> = () => {
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
  });

  const { login } = useContext(authContext);

  useRedirectBasedOnAuthentication("unauthenticated");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await toast.promise(login(formState.email, formState.password), {
      pending: "Login in process...",
      success: "Login success!",
      error: "Login failed",
    });
  };

  return (
    <div
      className="h-screen font-sans login bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="h-full flex flex-1 justify-center items-center">
        <div className="w-full max-w-lg flex flex-col items-stretch">
          <form
            onSubmit={handleSubmit}
            className="m-4 p-10 bg-white bg-opacity-25 rounded shadow-xl"
          >
            <p className="text-gray-700 text-center text-xl font-bold">LOGIN</p>
            <Input
              label={"Email"}
              type={"email"}
              name={"email"}
              value={formState.email}
              onChange={(e) =>
                setFormState({ ...formState, email: e.target.value })
              }
              error={undefined}
              icon={<MdOutlineMailOutline className="icon" />}
              width={"100%"}
            />
            <Input
              label={"Password"}
              type={"password"}
              name={"password"}
              value={formState.password}
              onChange={(e) =>
                setFormState({ ...formState, password: e.target.value })
              }
              error={undefined}
              icon={<FiKey className="icon" />}
              width={"100%"}
            />

            <div className="mt-4 items-center flex justify-between">
              <Link
                to="/register"
                className="inline-block right-0 align-baseline font-bold text-sm text-500 hover:text-blue-800"
              >
                Don't have an account?
              </Link>
              <button
                className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 hover:bg-gray-800 rounded"
                type="submit"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
