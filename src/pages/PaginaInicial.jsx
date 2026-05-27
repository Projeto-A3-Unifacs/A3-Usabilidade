import { Link } from 'react-router-dom';
import logo from '../assets/logodois.png';
import '../styles/style.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import GameSection from '../components/GameSection';
import GameCard from '../components/GameCard';
import Rodape from '../components/Rodape';
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
];
  

   const [jogos, setJogos] = useState([]);
   const [usuarioLogado, setUsuarioLogado] = useState(false);
   const [busca, setBusca] = useState('');
   const [resultadoBusca, setResultadoBusca] = useState([]);
   function buscarJogos(){

   const filtrados = jogos.filter((jogo) =>

      jogo.nome
         .toLowerCase()
         .includes(busca.toLowerCase())

   );

   setResultadoBusca(filtrados);

}

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
         
         <input 
    className="busca" 
    placeholder="Buscar"    
    type="text"
    value={busca}
   onChange={(e) => setBusca(e.target.value)}
   />

    <img src={logoBusca} 
    className="icone-busca"

     onClick={buscarJogos}
    />

    </div>

    <div className="links">
      
     {
         usuarioLogado ? (

            <>

               <Link to="/perfil">Perfil</Link>

               <Link to="/carrinho">Carrinho</Link>

               <Link to="/biblioteca">Biblioteca</Link>

               <Link to="/logout">Sair</Link>

            </>

         ) : (

            <Link to="/login">Entrar</Link>

         )
      }

    </div>
  </div>

  <div className="conteudo">


{
   busca.trim() !== '' ? (

      <div className="resultado-busca">

         <h2>Resultados da busca</h2>

         <div className="games-row">

            {
               resultadoBusca.length > 0 ? (

                 resultadoBusca.map((jogo) => (

                     <GameCard
                        key={jogo.id}
                        jogo={jogo}
                     />

                  ))

               ) : (

                  <p>Nenhum jogo encontrado.</p>

               )
            }

         </div>

      </div>

   ) : (

      <>
      
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

      </>

   )
}

      </div>

      
    <Rodape
     logo={logo}
     />


    
</div>
   
    )
}

export default PaginaInicial