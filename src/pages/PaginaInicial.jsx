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

import semImagem from '../assets/games/default.png';

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
      jogos.slice(0,6);

   const lancamentos =
      jogos.slice(6,12);

   const promocoes =
      jogos.filter(
         jogo => jogo.desconto > 0
      );

   const maisVendidos =
      jogos.slice(12,18);


    return(
        <div className="inicial">
        <div className="topo">
    <input 
    className="busca" 
    placeholder="Buscar"  
    type="text"/>

    <div className="links">
       <Link to="/login">
      Entrar
     </Link>
    </div>
  </div>
<div >

   <GameSection
            titulo="Destaques"
            jogos={destaques}
         />

         <GameSection
            titulo="Lançamentos"
            jogos={lancamentos}
         />

         <GameSection
            titulo="Promoções"
            jogos={promocoes}
         />

         <GameSection
            titulo="Mais vendidos"
            jogos={maisVendidos}
         />

      </div>
   

   <footer className="footer">
    <div className="logo">
     <img src={logo} />
     </div>
      <p>© 2026 GameNest - Todos os direitos reservados</p>

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