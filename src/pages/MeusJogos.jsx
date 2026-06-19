import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../styles/stylemeusjogos.css';

import Navbar from '../components/Navbar';
import Rodape from '../components/Rodape';

import logo from '../assets/logodois.png';
import controle from '../assets/controle.png';
import medalha from '../assets/medalha.png';
import relogio from '../assets/relogio.png';
import windowsIcon from '../assets/windows.png';

import {
  getToken,
  isAuthenticated,
  logoutUser
} from '../utils/auth';

const API_URL =
  'https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1';

function MeusJogos() {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [usuarioLogado, setUsuarioLogado] =
    useState(false);

  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] =
    useState('alfabetica');

  const [paginaAtual, setPaginaAtual] =
    useState(1);

  const ITENS_POR_PAGINA = 30;

  const navigate = useNavigate();

  function logout() {
    logoutUser();

    setUsuarioLogado(false);

    navigate('/login', {
      replace: true
    });
  }

  function obterIdDoJogo(game) {
    return (
      game?.jogo?.id ??
      game?.jogo?.jogoId ??
      game?.jogo?.idJogo ??
      game?.jogoId ??
      game?.fkJogo ??
      game?.idJogo ??
      null
    );
  }

  function abrirDetalhesDoJogo(game) {
    const jogoId = obterIdDoJogo(game);

    if (!jogoId) {
      console.error(
        'O ID do jogo não foi encontrado:',
        game
      );

      setError(
        'Não foi possível abrir os detalhes deste jogo.'
      );

      return;
    }

    navigate(`/detalhejogo/${jogoId}`);
  }

  useEffect(() => {
    async function fetchJogos() {
      setLoading(true);
      setError(null);

      const autenticado = isAuthenticated();

      setUsuarioLogado(autenticado);

      if (!autenticado) {
        setLoading(false);

        navigate('/login', {
          replace: true
        });

        return;
      }

      const token = getToken();

      try {
        const response = await axios.get(
          `${API_URL}/usuarios/my/games`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const dadosRecebidos = Array.isArray(
          response.data
        )
          ? response.data
          : [];

        const jogosComprados =
          dadosRecebidos.filter(
            (game) =>
              typeof game.chaveAtivacao ===
                'string' &&
              game.chaveAtivacao.trim().length >
                0
          );

        setJogos(jogosComprados);
      } catch (err) {
        console.error(
          'Erro ao carregar biblioteca:',
          err.response?.data ||
            err.message
        );

        if (err.response?.status === 401) {
          logoutUser();

          setUsuarioLogado(false);

          navigate('/login', {
            replace: true
          });

          return;
        }

        setError(
          err.response?.data?.message ||
            'Erro ao carregar jogos.'
        );

        setJogos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchJogos();
  }, [navigate]);

  const totalJogos = jogos.length;

  const jogosFiltrados = [...jogos]
    .filter((game) => {
      const nome =
        game.jogo?.nome || '';

      return nome
        .toLowerCase()
        .includes(
          busca.trim().toLowerCase()
        );
    })
    .sort((gameA, gameB) => {
      const nomeA =
        gameA.jogo?.nome || '';

      const nomeB =
        gameB.jogo?.nome || '';

      if (
        ordenacao === 'alfabetica'
      ) {
        return nomeA.localeCompare(
          nomeB
        );
      }

      if (
        ordenacao ===
        'alfabetica_desc'
      ) {
        return nomeB.localeCompare(
          nomeA
        );
      }

      return 0;
    });

  const totalPaginas = Math.ceil(
    jogosFiltrados.length /
      ITENS_POR_PAGINA
  );

  const indiceInicial =
    (paginaAtual - 1) *
    ITENS_POR_PAGINA;

  const indiceFinal =
    indiceInicial +
    ITENS_POR_PAGINA;

  const jogosPaginados =
    jogosFiltrados.slice(
      indiceInicial,
      indiceFinal
    );

  return (
    <div className="meusjogos-container">
      <header className="meusjogos-header">
        <img
          src={logo}
          alt="Logo Game Nest"
          className="meusjogos-logo"
        />

        <Navbar
          usuarioLogado={
            usuarioLogado
          }
          logout={logout}
        />
      </header>

      <main className="meusjogos-container-principal">
        <section className="meusjogos-games-section">
          <div className="meusjogos-header-top">
            <h2 className="meusjogos-page-title">
              Meus Jogos
            </h2>

            <div className="meusjogos-summary-cards">
              <div className="meusjogos-summary-card-small">
                <img
                  src={controle}
                  alt="Jogos adquiridos"
                />

                <span>
                  {totalJogos}
                  <br />

                  <small>
                    Jogos adquiridos
                  </small>
                </span>
              </div>

              <div className="meusjogos-summary-card-small">
                <img
                  src={medalha}
                  alt="Conquistas"
                />

                <span>
                  0
                  <br />

                  <small>
                    Conquistas
                  </small>
                </span>
              </div>

              <div className="meusjogos-summary-card-small">
                <img
                  src={relogio}
                  alt="Tempo jogado"
                />

                <span>
                  0h
                  <br />

                  <small>
                    Tempo jogado
                  </small>
                </span>
              </div>
            </div>
          </div>

          <p className="meusjogos-paragrafo">
            {error
              ? `Erro: ${error}`
              : totalJogos === 0
                ? 'Você não possui jogos.'
                : 'Confira todos os jogos que você possui na sua biblioteca.'}
          </p>

          <div className="meusjogos-search-filters">
            <div className="meusjogos-search-box">
              <input
                type="text"
                placeholder="Buscar jogos..."
                value={busca}
                onChange={(event) => {
                  setBusca(
                    event.target.value
                  );

                  setPaginaAtual(1);
                }}
              />

              <span className="meusjogos-search-icon">
                🔍
              </span>
            </div>

            <div className="Ordena">
              <label>
                Ordenar Por:
              </label>

              <select
                value={ordenacao}
                onChange={(event) => {
                  setOrdenacao(
                    event.target.value
                  );

                  setPaginaAtual(1);
                }}
              >
                <option value="alfabetica">
                  A → Z
                </option>

                <option value="alfabetica_desc">
                  Z → A
                </option>
              </select>
            </div>
          </div>

          <div className="meusjogos-games-grid">
            {loading ? (
              <p>
                Carregando jogos...
              </p>
            ) : jogosFiltrados.length ===
              0 ? (
              <p>
                Nenhum jogo encontrado.
              </p>
            ) : (
              jogosPaginados.map(
                (game, index) => {
                  const jogoId =
                    obterIdDoJogo(game);

                  return (
                    <div
                      className="meusjogos-game-card"
                      key={
                        game.id ||
                        `${jogoId}-${index}`
                      }
                    >
                      <div className="meusjogos-game-info">
                        <h3>
                          {game.jogo?.nome ||
                            'Jogo sem nome'}
                        </h3>

                        <div className="meusjogos-platforms">
                          <img
                            src={
                              windowsIcon
                            }
                            alt="Windows"
                          />
                        </div>

                        <p>
                          <strong>
                            Chave:
                          </strong>

                          <br />

                          {
                            game.chaveAtivacao
                          }
                        </p>
                      </div>

                      <div className="meusjogos-game-buttons">
                        <button
                          type="button"
                          className="meusjogos-btn-game"
                        >
                          Jogar
                        </button>

                        <button
                          type="button"
                          className="meusjogos-btn-info"
                          onClick={() =>
                            abrirDetalhesDoJogo(
                              game
                            )
                          }
                        >
                          Sobre o jogo
                        </button>
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>

          {totalPaginas > 0 && (
            <div className="meusjogos-pagination">
              {paginaAtual > 1 && (
                <button
                  type="button"
                  className="meusjogos-page-circle"
                  onClick={() =>
                    setPaginaAtual(
                      paginaAtual - 1
                    )
                  }
                >
                  ‹
                </button>
              )}

              {Array.from(
                {
                  length:
                    totalPaginas
                },
                (_, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`meusjogos-page-circle ${
                      paginaAtual ===
                      index + 1
                        ? 'meusjogos-active'
                        : ''
                    }`}
                    onClick={() =>
                      setPaginaAtual(
                        index + 1
                      )
                    }
                  >
                    {index + 1}
                  </button>
                )
              )}

              {paginaAtual <
                totalPaginas && (
                <button
                  type="button"
                  className="meusjogos-page-circle"
                  onClick={() =>
                    setPaginaAtual(
                      paginaAtual + 1
                    )
                  }
                >
                  ›
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <Rodape logo={logo} />
    </div>
  );
}

export default MeusJogos;