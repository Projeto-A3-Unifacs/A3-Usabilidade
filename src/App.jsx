
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import PaginaInicial from './pages/PaginaInicial';


function App() {
   return (

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

        

      </Routes>

    </BrowserRouter>

  );

}



export default App
