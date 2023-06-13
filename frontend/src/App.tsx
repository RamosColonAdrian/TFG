// Punto de entrada de la aplicación 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContextProvider from "./contexts/authContext/authContext";
import Routing from "./shared/routing/Routing";
import { BrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";

export type RegisterDTO = {
  email: string;
  password: string;
  name: string;
  surname: string;
};

// Componente principal de la aplicación 
function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <ToastContainer newestOnTop />
        <Layout>
          <Routing />
        </Layout>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
