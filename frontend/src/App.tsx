import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContextProvider from './contexts/authContext/authContext';
import Routing from './shared/routing/Routing';
import { BrowserRouter } from 'react-router-dom';

export type RegisterDTO = { email: string, password: string, name: string, surname: string }

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <ToastContainer />
        <Routing />
      </AuthContextProvider>
    </BrowserRouter>

  )
}

export default App
