import React, { useState, useEffect, useContext } from 'react';
import Input from '../../shared/components/Input/Input';
import './Register.css';
import background from "../../assets/img_back_login.png";
import { FiKey } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { toast } from 'react-toastify';
import { RegisterDTO } from '../../App';
import { authContext } from '../../contexts/authContext/authContext';
import { Link } from 'react-router-dom';

interface RegisterProps {
}


const Register: React.FC<RegisterProps> = () => {
    const { register } = useContext(authContext)

    const [passwordsNotMatchingError, setPasswordsNotMatchingError] = useState(false)
    const [formState, setFormState] = useState<{
        name: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
    }>({
        name: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (passwordsNotMatchingError) {
            toast.error("Passwords don't match")
            return;
        }
        await toast.promise(register(
            { email: formState.email, password: formState.password, name: formState.name, surname: formState.lastName }
        ), {
            pending: 'Register in process...',
            success: 'Register success!',
            error: 'Register failed',
        })

    };

    useEffect(() => {
        if (!formState.password || !formState.confirmPassword) {
            setPasswordsNotMatchingError(false);
            return;
        }

        if (formState.password !== formState.confirmPassword) {
            setPasswordsNotMatchingError(true)
            return
        }
        setPasswordsNotMatchingError(false)
    }, [formState.password, formState.confirmPassword])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        });
    };

    const isAnyFieldEmpty = (!formState.name || !formState.lastName || !formState.email || !formState.password || !formState.confirmPassword)



    return (
        <div id="contenedor">
            <div id="izquierda">
                <img src={background} />
            </div>
            <div id="derecha">
                <h2>Registro</h2>
                <form onSubmit={handleSubmit}>
                    <div className='input-row'>
                        <Input
                            label={"Nombre"}
                            type={"text"}
                            name={'name'}
                            value={formState.name}
                            onChange={handleChange}
                            icon={<FiKey className="icon" />}
                            width={"50%"}
                        />
                        <Input
                            label={"Apellido"}
                            type={"text"}
                            name={'lastName'}
                            value={formState.lastName}
                            onChange={handleChange}
                            icon={<FiKey className="icon" />}
                            width={"50%"}
                        />
                    </div>
                    <Input
                        label={"Email"}
                        type={"email"}
                        name={'email'}
                        value={formState.email}
                        onChange={handleChange}
                        icon={<MdOutlineMailOutline className='icon' />}
                        width={"100%"}
                    />
                    <Input
                        label={"Password"}
                        type={"password"}
                        name={"password"}
                        value={formState.password}
                        onChange={handleChange}
                        icon={<FiKey className='icon' />}
                        width={"100%"}
                    />
                    <Input
                        label={"Confirmar Password"}
                        type={"password"}
                        name={"confirmPassword"}
                        value={formState.confirmPassword}
                        onChange={handleChange}
                        icon={<FiKey className='icon' />}
                        width={"100%"}
                        error={passwordsNotMatchingError ? "Passwords don't match" : undefined}
                    />
                    <button type="submit" disabled={passwordsNotMatchingError || isAnyFieldEmpty}>Registrarse</button>
                    <p>Already have an account? <Link to="/login">Log in instead</Link></p>
                </form>
            </div>
        </div>
    );
};

export default Register;
