import { Link } from 'react-router-dom';
import '../styles/style.css'

function Navbar({ usuarioLogado, logout }){

   return(
  
      <div className="links">

         {
            usuarioLogado ? (
               <>
               <Link to="/">Página Inicial</Link>

               <Link to="/carrinho">Carrinho</Link>

               <Link to="/meusjogos">Biblioteca</Link>

               <Link to="/perfil">Perfil</Link>
               <a onClick={logout}>
                  Sair
               </a>


              </>
            ) : (
              <>
               <Link to="/login">
                  Entrar
               </Link>

               <Link to="/cadastro">
                  Cadastre-se
               </Link>               

                </>      
            )
         }

      </div>
     

   )

}
export default Navbar