import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import logo from '../assets/logodois.png';
import styles from '../styles/style.module.css'; // <-- Importação do CSS Modules

import GameSection from '../components/GameSection';
import GameCard from '../components/GameCard';
import Rodape from '../components/Rodape';
import Navbar from '../components/Navbar';

import funil from '../assets/funil.png';

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
import estrela from '../assets/estrela.png';
import fogete from '../assets/foguete.png';
import incendio from '../assets/incendio.png';
import promo from '../assets/promo.png';

import semImagem from '../assets/games/padrao.png';

import {
  getToken,
  isAuthenticated,
  logoutUser
} from '../utils/auth';

const API_URL =
  'https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000
});

/*
  Adiciona o token automaticamente em todas
  as requisições feitas pela instância "api".
*/
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

function PaginaInicial() {
  const imagens = [
    a, b, c, d, e, f, h, i, j, k, l, m, n
  ];

  const navigate = useNavigate();

  const [jogos, setJogos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [busca, setBusca] = useState('');
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [ordenacao, setOrdenacao] = useState('Mais populares');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  function logout() {
    logoutUser();
    setUsuarioLogado(false);
    navigate('/login', { replace: true });
  }

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarDadosIniciais() {
      setCarregando(true);
      setErro('');

      const autenticado = isAuthenticated();
      setUsuarioLogado(autenticado);

      if (!autenticado) {
        navigate('/login', { replace: true });
        if (componenteAtivo) {
          setCarregando(false);
        }
        return;
      }

      try {
        const [respostaJogos, respostaCategorias] = await Promise.all([
          api.get('/public/jogos'),
          api.get('/categorias')
        ]);

        if (!componenteAtivo) {
          return;
        }

        const jogosRecebidos = Array.isArray(respostaJogos.data)
            ? respostaJogos.data
            : [];

        const jogosComImagem = jogosRecebidos.map((jogo, index) => ({
              ...jogo,
              imagem: imagens[index] || semImagem
        }));

        setJogos(jogosComImagem);

        setCategorias(
          Array.isArray(respostaCategorias.data)
            ? respostaCategorias.data
            : []
        );
      } catch (error) {
        if (!componenteAtivo) {
          return;
        }

        console.error(
          'Erro ao carregar a página inicial:',
          error.response?.data || error.message
        );

        if (error.response?.status === 401) {
          logoutUser();
          setUsuarioLogado(false);
          setErro('Sua sessão expirou ou o token é inválido. Faça login novamente.');
          navigate('/login', { replace: true });
          return;
        }

        if (error.code === 'ECONNABORTED') {
          setErro('A API demorou para responder. Tente novamente.');
          return;
        }

        setErro(
          error.response?.data?.message ||
            error.response?.data?.error ||
            'Não foi possível carregar os jogos e categorias.'
        );
      } finally {
        if (componenteAtivo) {
          setCarregando(false);
        }
      }
    }

    carregarDadosIniciais();

    return () => {
      componenteAtivo = false;
    };
  }, [navigate]);

  function alternarGenero(nomeCategoria) {
    if (categoriaSelecionada === nomeCategoria) {
      setCategoriaSelecionada(null);
    } else {
      setCategoriaSelecionada(nomeCategoria);
    }
  }

  function limparFiltros() {
    setCategoriaSelecionada(null);
    setBusca('');
    setOrdenacao('Mais populares');
  }

  let jogosParaExibir = [...jogos];

  if (busca.trim() !== '') {
    jogosParaExibir = jogosParaExibir.filter((jogo) =>
      jogo.nome?.toLowerCase().includes(busca.trim().toLowerCase())
    );
  }

  if (categoriaSelecionada !== null) {
    jogosParaExibir = jogosParaExibir.filter((jogo) => {
      const categoriaJogo =
        typeof jogo.categoria === 'string'
          ? jogo.categoria
          : jogo.categoria?.nome ||
            jogo.nomeCategoria ||
            jogo.categoriaNome ||
            jogo.nome_categoria;

      if (!categoriaJogo) {
        return false;
      }

      return (
        categoriaJogo.trim().toLowerCase() ===
        categoriaSelecionada.trim().toLowerCase()
      );
    });
  }

  if (ordenacao === 'Menor preço') {
    jogosParaExibir.sort(
      (jogoA, jogoB) => Number(jogoA.preco || 0) - Number(jogoB.preco || 0)
    );
  } else if (ordenacao === 'Maior preço') {
    jogosParaExibir.sort(
      (jogoA, jogoB) => Number(jogoB.preco || 0) - Number(jogoA.preco || 0)
    );
  }

  const isFiltrando =
    busca.trim() !== '' ||
    categoriaSelecionada !== null ||
    ordenacao !== 'Mais populares';

  const destaques = jogos.slice(0, 10);
  const lancamentos = jogos.slice(5, 15);
  const promocoes = jogos.filter((jogo) => Number(jogo.preco) < 40).slice(0, 10);
  const maisVendidos = jogos.slice(10, 20);

  if (carregando) {
    return (
      <div className={styles.inicial}>
        <div className={styles.topo}>
          <Navbar usuarioLogado={usuarioLogado} logout={logout} />
        </div>

        <div className={styles.conteudo}>
          <p>Carregando jogos e categorias...</p>
        </div>

        <Rodape logo={logo} />
      </div>
    );
  }

  return (
    <div className={styles.inicial}>
      <div className={styles.topo}>
        <div className={styles['busca-wrapper']}>
         <div className={styles['busca-container']}>
            <input
              className={styles.busca}
              placeholder="Buscar"
              type="text"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />

            <img
              src={logoBusca}
              className={styles['icone-busca']}
              alt="Buscar"
            />

            <img
              src={funil}
              className={styles['icone-funil-toggle']}
              alt="Mostrar Filtros"
              onClick={() => setMostrarFiltro((valorAtual) => !valorAtual)}
            />
          </div>
        </div>

        <Navbar usuarioLogado={usuarioLogado} logout={logout} />
      </div>

      <div className={styles.conteudo}>
        {erro && (
          <p
            style={{
              color: '#b00020',
              textAlign: 'center',
              marginBottom: '20px'
            }}
          >
            {erro}
          </p>
        )}

        {isFiltrando || mostrarFiltro ? (
          <div className={styles['layout-busca']}>
            {mostrarFiltro && (
              <div className={styles['filtro-sidebar']}>
                <div className={styles['filtro-header']}>
                  <img
                    src={funil}
                    alt="Filtro"
                    className={styles['icone-filtro-header']}
                  />
                  <span>Filtros</span>
                </div>

                <div className={styles['filtro-ordenacao']}>
                  <label>Ordenar por:</label>
                  <select
                    value={ordenacao}
                    onChange={(event) => setOrdenacao(event.target.value)}
                  >
                    <option value="Mais populares">Mais populares</option>
                    <option value="Menor preço">Menor preço</option>
                    <option value="Maior preço">Maior preço</option>
                  </select>
                </div>

                <div className={styles['filtro-generos']}>
                  <label>Gêneros</label>
                  {categorias.length > 0 ? (
                    categorias.map((categoria) => (
                        <div className={styles['checkbox-item']} key={categoria.id}>
                          <input
                            type="checkbox"
                            id={`cat-${categoria.id}`}
                            checked={categoriaSelecionada === categoria.nome}
                            onChange={() => alternarGenero(categoria.nome)}
                          />
                          <label htmlFor={`cat-${categoria.id}`}>
                            {categoria.nome}
                          </label>
                        </div>
                      )
                    )
                  ) : (
                    <p>Nenhuma categoria encontrada.</p>
                  )}
                </div>

                <button
                  type="button"
                  className={styles['btn-limpar']}
                  onClick={limparFiltros}
                >
                  🗑️ Limpar filtros
                </button>
              </div>
            )}

            <div className={styles['resultado-busca']}>
              <h2>Resultados da busca</h2>
              <div className={styles['games-row']}>
                {jogosParaExibir.length > 0 ? (
                  jogosParaExibir.map((jogo) => (
                      <GameCard key={jogo.id} jogo={jogo} />
                  ))
                ) : (
                  <p>Nenhum jogo encontrado para esta categoria ou busca.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <GameSection titulo="Destaques" icone={estrela} jogos={destaques} />
            <GameSection titulo="Lançamentos" icone={fogete} jogos={lancamentos} />
            <GameSection titulo="Promoções" icone={promo} jogos={promocoes} />
            <GameSection titulo="Mais vendidos" icone={incendio} jogos={maisVendidos} />
          </>
        )}
      </div>

      <Rodape logo={logo} />
    </div>
  );
}

export default PaginaInicial;