import React from "react";

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

const Input: React.FC<InputProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  icon,
  width,
}) => {
  return (
      <div className="max-w-2xl mx-auto">
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {icon ? icon : null}
          </div>
          <input
            id="input-group-1"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            style={{ width }}
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    
  );
};

export default Input;
