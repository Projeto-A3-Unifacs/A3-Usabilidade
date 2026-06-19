import { Link } from 'react-router-dom';
import styles from '../styles/style.module.css';

function Navbar({ usuarioLogado, logout }) {
   return (
      <div className={styles.links}>
         {usuarioLogado ? (
            <>
               <Link to="/">Página Inicial</Link>
               <Link to="/carrinho">Carrinho</Link>
               <Link to="/meusjogos">Biblioteca</Link>
               <Link to="/editarperfil">Perfil</Link>
               <a onClick={logout} style={{ cursor: 'pointer' }}>
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
         )}
      </div>
   );
}

export default Navbar;