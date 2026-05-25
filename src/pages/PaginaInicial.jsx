import { Link } from 'react-router-dom';
import logo from '../assets/logodois.png';
import '../styles/style.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import GameSection from '../components/GameSection';
import a from '../assets/games/a.png';
import b from '../assets/games/b.png';
import c from '../assets/games/c.png';
import d from '../assets/games/d.png';
import e from '../assets/games/e.png';
import f from '../assets/games/f.png';
import h from '../assets/games/h.png';
import i from '../assets/games/i.png';
import j from '../assets/games/j.png';
import k from '../assets/games/k.png';
import l from '../assets/games/l.png';
import m from '../assets/games/m.png';
import n from '../assets/games/n.png';
import o from '../assets/games/o.png';
import logoBusca from '../assets/lupa.png';
import { FaSearch } from "react-icons/fa";
import estrela from '../assets/estrela.png';
import fogete from '../assets/foguete.png';
import incendio from '../assets/incendio.png';
import promo from '../assets/promo.png';

import semImagem from '../assets/games/padrao.png';

function PaginaInicial(){

     const imagens = [
   a,
   b,
   c,
   d,
   e,
   f,
   h,
   i,
   j,
   k,
   l,
   m,
   n,
   o
];
  

   const [jogos, setJogos] = useState([]);
   const [usuarioLogado, setUsuarioLogado] = useState(false);

   useEffect(() => {

      async function buscarJogos(){

         try{

            const resposta = await axios.get(
               "http://localhost:3000/api/v1/public/jogos"
            );

            setJogos(resposta.data);

                const jogosComImagem = resposta.data.map((jogo, index) => {

   return{

      ...jogo,

      imagem:
         imagens[index] || semImagem

   }

});

         setJogos(jogosComImagem);


         }catch(erro){

            console.log(erro);

         }

     

      }

       

      buscarJogos();

   }, []);

  

   const destaques =
   jogos.slice(0,10);

const lancamentos =
   jogos.slice(5,15);

const promocoes =
   jogos
      .filter(jogo => jogo.preco < 40)
      .slice(0,10);

const maisVendidos =
   jogos.slice(10,20);

    return(
        <div className="inicial">
        <div className="topo">
         
         <div className="busca-container">
         <img src={logoBusca} className="icone-busca" />
         <input 
    className="busca" 
    placeholder="Buscar"    
    type="text"/>
    </div>

    <div className="links">
       <Link to="/login">
      Entrar
     </Link>
    </div>
  </div>
<div >

   <GameSection
            titulo="Destaques"
              icone={estrela}
            jogos={destaques}
         />

         <GameSection
            titulo="Lançamentos"
              icone={fogete}
            jogos={lancamentos}
         />

         <GameSection
            titulo="Promoções"
            icone={promo}
            jogos={promocoes}
         />

         <GameSection
            titulo="Mais vendidos"
              icone={incendio}
            jogos={maisVendidos}
         />

      </div>
   

   <footer className="footer">
    <div className="logo">
     <img src={logo} />
     </div>
      <p>© 2026 Arcade Corporation. Todos os direitos reservados. Todas as marcas registradas são propriedade dos seus respectivos donos no Brasil e em outros países.</p>

      <div className="footer-links">
        <a href="#">Termos de Uso</a>
        <a href="#">Privacidade</a>
        <a href="#">Contato</a>
      </div>

    </footer>
    </div>
   
    )
}

export default PaginaInicial