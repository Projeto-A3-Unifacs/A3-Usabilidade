import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "../styles/Listadedesejos.css";
import Navbar from '../components/Navbar';
import Rodape from '../components/Rodape';
import logo from '../assets/logodois.png';
import { FaCalendarAlt } from "react-icons/fa";
import { FaTag } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
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

import { getToken, isAuthenticated } from '../utils/auth';

const imagensJogos = [a, b, c, d, e, f, h, i, j, k, l, m, n];

function pegarImagemDoJogo(id) {
  const indice = id % imagensJogos.length;
  return imagensJogos[indice];
}

function Listadedesejos() {
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarListaDesejos();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setUsuarioLogado(false);
    navigate("/");
  }

async function removerDaLista(jogoId) {
  try {
    const token = getToken();

    await axios.delete(
      "https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/lista-desejo/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          jogoId,
        },
      }
    );

    setJogos((prev) => prev.filter((jogo) => jogo.id !== jogoId));

    toast.success("Jogo removido da lista de desejos!");
  } catch (erro) {
    console.error(erro);
    toast.error(
      erro.response?.data?.error ||
      "Erro ao remover jogo da lista."
    );
  }
}

async function comprarJogo(jogoId) {
  try {
    const token = getToken();

    await axios.post(
      "https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/carrinho/add",
      {
        jogoId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Jogo adicionado ao carrinho!");

    navigate("/pagamento");

  } catch (erro) {
    console.error(erro);

    toast.error(
      erro.response?.data?.message ||
      "Erro ao adicionar ao carrinho."
    );
  }
}

  
   async function limparLista() {
  if (!window.confirm("Deseja limpar toda a lista de desejos?")) {
    return;
  }

  try {
    const token = getToken();

    await Promise.allSettled(
      jogos.map((jogo) =>
        axios.delete(
          "https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/lista-desejo/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              jogoId: jogo.id,
            },
          }
        )
      )
    );

    setJogos([]);

    toast.success("Lista limpa com sucesso!");
  } catch (erro) {
    console.error(erro);
    toast.error("Erro ao limpar lista.");
  }
}

  async function carregarListaDesejos() {
    const token = localStorage.getItem("token");
    
    try {
      const autenticado = isAuthenticated();
      setUsuarioLogado(autenticado);
      
      
      if (!autenticado) {
        navigate('/login');
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
            `https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/empresas/${jogo.fk_empresa}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          const categoriaResposta = await axios.get(
            `https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/categorias/${jogo.fk_categoria}`,
            {
              headers: { Authorization: `Bearer ${token}` }
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
    } finally {
      setCarregando(false);
    }
  }
   console.log(jogos);

  return (
    <div className="lista-desejos-page">
      <header>
        <img src={logo} alt="Logo Game Nest" className="logo" />
        <Navbar usuarioLogado={usuarioLogado} logout={logout} />
      </header>

      <main>
        <section className="topo">
          <div>
            <h1>Lista de Desejos</h1>
            <p id="paragrafo">Aqui estão os jogos que você adicionou à sua lista de desejos.</p>
          </div>

          <div className="acoes-topo">
            <span>{jogos.length} jogos</span>
            <button className="limpar"
             onClick={limparLista}
            >🗑️ Limpar lista</button>
          </div>
        </section>
     
        <section className="lista">
          {carregando && (
            <div className="lista-vazia">
              <p>Carregando lista de desejos...</p>
            </div>
          )}
            
          {!carregando && jogos.length === 0 && (
            <div className="lista-vazia">
              <p>Nenhum jogo encontrado na lista de desejos.</p>
            </div>
          )}

          {!carregando &&
            jogos.map((jogo) => (
             <Jogo
  key={jogo.id}
  jogo={jogo}
  onRemover={removerDaLista}
  onComprar={comprarJogo}
/>
            ))}
        </section>
      </main>

      <Rodape logo={logo} />
    </div>
  );

  
}

function Jogo({ jogo,
  onRemover,
  onComprar}) {
  return (
    <article className="jogo">

      <img
        src={jogo.imagem}
        alt={jogo.nome}
        className="capa"
      />

      <div className="info">
        <h2>{jogo.nome}</h2>

       <div className="detalhes">

  <div className="detalhe">
    <FaCalendarAlt className="iconeDetalhe" />

    <div>
      <strong>Ano</strong>
      <span>{jogo.ano}</span>
    </div>
  </div>

  <div className="detalhe">
    <FaTag className="iconeDetalhe" />

    <div>
      <strong>Categoria</strong>
      <span>{jogo.categoria}</span>
    </div>
  </div>

  <div className="detalhe">
    <FaBuilding className="iconeDetalhe" />

    <div>
      <strong>Empresa</strong>
      <span>{jogo.empresa}</span>
    </div>
  </div>

</div>

        <p className="descricao">
          {jogo.descricao.split('"')}
        </p>
      </div>

      <div className="ladoDireito">
        <div className="preco">
          R$ {Number(jogo.preco)
            .toFixed(2)
            .replace(".", ",")}
        </div>

        <div className="botoes">

  <button className="btn comprar"
      className="btn comprar"
  onClick={() => onComprar(jogo.id)}
  
  >
    <FaShoppingCart className="iconeBotao" />
    <span>Comprar</span>
  </button>

  <button className="btn remover"
      className="btn remover"
      onClick={() => onRemover(jogo.id)}
  >
    <FaTrashAlt className="iconeBotao" />
    <span>Remover</span>
  </button>

</div>
      </div>

    </article>
  );
}

export default Listadedesejos;