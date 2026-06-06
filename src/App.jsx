
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import PaginaInicial from './pages/PaginaInicial';
import { Toaster } from 'react-hot-toast';
import Carrinho from './pages/Carrinho';
import MeusJogos from './pages/MeusJogos';
import Compraaprovada from './pages/Compraaprovada'
import PainelJogo from './pages/PainelJogo';
import Listadedesejos from './pages/Listadedesejos';

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

        <Route
          path="/meusjogos"
          element={<MeusJogos />}
        />

 <Route
          path="/compraaprovada"
          element={<Compraaprovada />}
        />

        <Route
          path="/paineljogo"
          element={<PainelJogo />}
        />

          <Route
          path="/listadedesejos"
          element={<Listadedesejos />}
        />

      </Routes>

    </BrowserRouter>
       </>     
  );

}



export default App
