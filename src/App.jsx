
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import PaginaInicial from './pages/PaginaInicial';
import { Toaster } from 'react-hot-toast';
import Carrinho from './pages/Carrinho';

function App() {
   return (
    <>
     <Toaster />
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        <Route
        path="/"
        element={< PaginaInicial />}
        />

        <Route
          path="/carrinho"
          element={<Carrinho />}
        />        

      </Routes>

    </BrowserRouter>
       </>     
  );

}



export default App
