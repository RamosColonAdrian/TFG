import { useState, useContext } from "react";
import Input from "../../shared/components/Input/Input";
import "./Login.css";

import { FiKey } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";

import background from "../../assets/img_back_login.png";

import { toast } from 'react-toastify';
import { authContext } from "../../contexts/authContext/authContext";

import { Link } from "react-router-dom";

interface LoginProps {
}

type FormState = {
  email: string;
  password: string;
};

const Login: React.FC<LoginProps> = () => {
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
  });

  const { login } = useContext(authContext)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await toast.promise(login(formState.email, formState.password), {
      pending: 'Login in process...',
      success: 'Login success!',
      error: 'Login failed',
    })
  };

  return (
    <div id="contenedor">
      <div id="izquierda">
        <img src={background} />
      </div>

      <div id="derecha">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
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
          <div id="remenber">
            <label>
              <input type="checkbox" name="remember" /> Recuérdame
            </label>
          </div>
          <button type="submit">Login</button>
          <div id="forgot_password">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
        </form>
      </div>
      <Link to="/register">Create an account</Link>
    </div>
  );
};

export default Login;
