import React from "react";
import './Input.css';

interface InputProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode; // Agregamos la prop icon
  width?: string; // Agregamos la prop width
}

const Input: React.FC<InputProps> = ({ label, type, name, value, onChange, error, icon, width }) => { // Renombramos la prop a 'Icon' y utilizamos la desestructuración para acceder al valor
  return (
    <div className="input-container">
      {icon ? icon : null}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="form-control"
        style={{ width }} // Usamos la prop width para establecer el ancho del input
      />
      <label htmlFor={name}>{label}</label>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
