// Función para concatenar clases de forma dinámica
export default function clxs(...args: any[]) {
  return args.filter(Boolean).join(" ");
}
