import React, { useState, useEffect, useContext } from "react";
import Input from "../../shared/components/Input/Input";
import background from "../../assets/login-new.jpeg";
import { FiKey } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { toast } from "react-toastify";
import { RegisterDTO } from "../../App";
import { authContext } from "../../contexts/authContext/authContext";
import { Link, Navigate } from "react-router-dom";
import useRedirectBasedOnAuthentication from "../../hooks/useRedirectBasedOnAuthentication";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const { register } = useContext(authContext);

  useRedirectBasedOnAuthentication("unauthenticated");

  const [passwordsNotMatchingError, setPasswordsNotMatchingError] =
    useState(false);
  const [formState, setFormState] = useState<{
    name: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordsNotMatchingError) {
      toast.error("Passwords don't match");
      return;
    }
    await toast.promise(
      register({
        email: formState.email,
        password: formState.password,
        name: formState.name,
        surname: formState.lastName,
      }),
      {
        pending: "Register in process...",
        success: "Register success!",
        error: "Register failed",
      }
    );
  };

  useEffect(() => {
    if (!formState.password || !formState.confirmPassword) {
      setPasswordsNotMatchingError(false);
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      setPasswordsNotMatchingError(true);
      return;
    }
    setPasswordsNotMatchingError(false);
  }, [formState.password, formState.confirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const isAnyFieldEmpty =
    !formState.name ||
    !formState.lastName ||
    !formState.email ||
    !formState.password ||
    !formState.confirmPassword;

  return (
    <div
      className="h-screen font-sans login bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="container  h-full flex flex-1 justify-center items-center">
        <div className="w-full max-w-lg flex flex-col items-stretch">
          <form
            onSubmit={handleSubmit}
            className="m-4 p-10 bg-white bg-opacity-25 rounded shadow-xl"
          >
            <p className="text-gray-700 text-center text-2xl font-bold mb-5">
              REGISTER
            </p>
            <div className="md:flex md:justify-between">
              <Input
                label={"Name"}
                type={"text"}
                name={"name"}
                value={formState.name}
                onChange={handleChange}
                icon={<AiOutlineUser className="icon" />}
                width={"90%"}
              />
              <Input
                label={"Surname"}
                type={"text"}
                name={"lastName"}
                value={formState.lastName}
                onChange={handleChange}
                width={"100%"}
              />
            </div>
            <Input
              label={"Email"}
              type={"email"}
              name={"email"}
              value={formState.email}
              onChange={handleChange}
              icon={<MdOutlineMailOutline className="icon" />}
              width={"100%"}
            />
            <Input
              label={"Password"}
              type={"password"}
              name={"password"}
              value={formState.password}
              onChange={handleChange}
              icon={<FiKey className="icon" />}
              width={"100%"}
            />
            <Input
              label={"Confirm Password"}
              type={"password"}
              name={"confirmPassword"}
              value={formState.confirmPassword}
              onChange={handleChange}
              icon={<FiKey className="icon" />}
              width={"100%"}
              error={
                passwordsNotMatchingError ? "Passwords don't match" : undefined
              }
            />
            <div className="mt-4 items-center flex justify-between">
              <Link
                to="/login"
                className="inline-block right-0 align-baseline font-bold text-sm text-500 hover:text-blue-800"
              >
                Already have an account?
              </Link>
              <button
                className="float-right px-5 py-2 text-white font-light tracking-wider bg-gray-900 hover:bg-gray-800 rounded"
                type="submit"
                disabled={passwordsNotMatchingError || isAnyFieldEmpty}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
