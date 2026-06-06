import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Listadedesejos.css";

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

  useEffect(() => {
    carregarListaDesejos();
  }, []);

  async function carregarListaDesejos() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
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
            `https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/empresas/${jogo.fk_empresa}`
          );

          const categoriaResposta = await axios.get(
            `https://api-vendas-jogos-digitais-9fvp.onrender.com/api/categorias/${jogo.fk_categoria}`
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
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <header>
        <div className="brand">
          <img src="/imagens/logo.png" alt="Logo Game Nest" className="logo" />
        </div>

        <nav>
          <a href="/">Página Inicial</a>
          <a href="#">Explorar</a>
          <a href="/carrinho">Carrinho</a>
          <a href="/meusjogos">Biblioteca</a>
          <a href="#">Perfil</a>
          <a href="#">Sair</a>
        </nav>
      </header>

      <main>
        <section className="topo">
          <div>
            <h1>Lista de Desejos</h1>
            <p>Aqui estão os jogos que você adicionou à sua lista de desejos.</p>
          </div>

          <div className="acoes-topo">
            <span>{jogos.length} jogos</span>
            <button className="limpar">Limpar lista</button>
          </div>
        </section>

        <section className="lista">
          {carregando && <p>Carregando lista de desejos...</p>}

          {!carregando && jogos.length === 0 && (
            <p>Nenhum jogo encontrado na lista de desejos.</p>
          )}

          {!carregando &&
            jogos.map((jogo) => (
              <Jogo key={jogo.id} jogo={jogo} />
            ))}
        </section>
      </main>

      <footer>
        <div className="brand">
          <img src="/imagens/logo.png" alt="Logo Game Nest" className="logo" />
        </div>

        <p>
          © 2026 Arcade Corporation. Todos os direitos reservados.
        </p>
      </footer>
    </>
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