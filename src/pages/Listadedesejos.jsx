import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Listadedesejos.css";
import Navbar from '../components/Navbar';
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
import logo from '../assets/logodois.png'
import {
  getToken,
  isAuthenticated
} from '../utils/auth';

const imagensJogos = [
  "a.png", "b.png", "c.png", "d.png", "e.png", "f.png",
  "h.png", "i.png", "j.png", "k.png", "l.png", "m.png", "n.png"
];

function pegarImagemDoJogo(id) {
  const indice = id % imagensJogos.length;
  return new URL(`../assets/games/${imagensJogos[indice]}`, import.meta.url).href;
}

function Listadedesejos() {
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  
 

  useEffect(() => {
   
    carregarListaDesejos();
  }, []);


  function logout() {
    localStorage.removeItem("token");
    setUsuarioLogado(false);
    navigate("/");
  }


  async function carregarListaDesejos() {
    
      const token = localStorage.getItem("token");
    try {
    const autenticado = isAuthenticated();
         setUsuarioLogado(autenticado);
          if (!autenticado) {
         navigate('/login');
        }
      const resposta = await axios.get(
        "https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/lista-desejo/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const jogosComDados = await Promise.all(
        resposta.data.map(async (jogo) => {
          const empresaResposta = await axios.get(
            `https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/empresas/${jogo.fk_empresa}`,
             {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
          );

          const categoriaResposta = await axios.get(
            `https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/categorias/${jogo.fk_categoria}`,
             {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
          );

          return {
            ...jogo,
            imagem: pegarImagemDoJogo(jogo.id),
            empresa: empresaResposta.data.nome,
            categoria: categoriaResposta.data.nome,
          };
        })
      );

      setJogos(jogosComDados);
    } catch (erro) {
      console.log("Erro ao carregar lista de desejos:", erro);
        console.log("Status:", erro.response?.status);
  console.log("Data:", erro.response?.data);
  console.log("Token:", localStorage.getItem("token"));
   console.log("HEADERS ENVIADOS:", {
  Authorization: `Bearer ${token}`
});
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="lista-desejos-page">
      <header>
        
          <img src={logo} 
          alt="Logo Game Nest" 
          className="logo" />
            

         <Navbar
         usuarioLogado={usuarioLogado}
         logout={logout}
         />

        
      </header>

      <main>
        <section className="topo">
          <div>
            <h1>Lista de Desejos</h1>
            <p id="paragrafo">Aqui estão os jogos que você adicionou à sua lista de desejos.</p>
          </div>

          <div className="acoes-topo">
            <span>{jogos.length} jogos</span>
            <button className="limpar">Limpar lista</button>
          </div>
        </section>
     
        <section className="lista">
             <div className="lista-vazia">
          {carregando && <p>Carregando lista de desejos...</p>}
           </div>
            
          {!carregando && jogos.length === 0 && (
   <div className="lista-vazia">
      <p>Nenhum jogo encontrado na lista de desejos.</p>
   </div>
)}

          {!carregando &&
            jogos.map((jogo) => (
              <Jogo key={jogo.id} jogo={jogo} />
            ))}
        </section>

      </main>

      <Rodape
      logo={logo}
      />
    </div>
  );
}

function Jogo({ jogo }) {
  return (
    <article className="jogo">
      <img src={jogo.imagem} alt={jogo.nome} className="capa" />

      <div className="info">
        <h2>{jogo.nome}</h2>

        <div className="detalhes">
          <div className="detalhe">
            <strong>Ano</strong>
            <span>{jogo.ano}</span>
          </div>

          <div className="detalhe">
            <strong>Categoria</strong>
            <span>{jogo.categoria}</span>
          </div>

          <div className="detalhe">
            <strong>Empresa</strong>
            <span>{jogo.empresa}</span>
          </div>
        </div>

        <p className="descricao">{jogo.descricao}</p>
      </div>

      <div className="preco">
        R$ {Number(jogo.preco).toFixed(2).replace(".", ",")}
      </div>

      <div className="botoes">
        <button className="btn comprar">Comprar</button>
        <button className="btn remover">Remover</button>
      </div>
    </article>
  );
}

export default Listadedesejos;