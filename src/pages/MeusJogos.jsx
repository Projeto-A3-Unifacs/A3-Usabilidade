import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/stylemeusjogos.css';
import Navbar from '../components/Navbar';
import Rodape from '../components/Rodape';
import logo from '../assets/logodois.png';
import controle from '../assets/controle.png';
import medalha from '../assets/medalha.png';
import relogio from '../assets/relogio.png';
import lupa from '../assets/lupa.png';
import windowsIcon from '../assets/windows.png';

function MeusJogos() {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState(false);

  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('alfabetica');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 30;

  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    setUsuarioLogado(false);
    navigate('/');
  }

  useEffect(() => {
    async function fetchJogos() {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      setUsuarioLogado(true);

      try {
        const response = await axios.get(
          'https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/usuarios/my/games',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const jogosComprados = (response.data || []).filter(
          (game) =>
            typeof game.chaveAtivacao === 'string' &&
            game.chaveAtivacao.trim().length > 0
        );

        setJogos(jogosComprados);
      } catch (err) {
        console.log(err.response?.data);
        console.log(err.response?.status);

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
    const nome = game.jogo?.nome || '';

    return nome
      .toLowerCase()
      .includes(busca.toLowerCase());
  })
  .sort((a, b) => {
    const nomeA = a.jogo?.nome || '';
    const nomeB = b.jogo?.nome || '';

    if (ordenacao === 'alfabetica') {
      return nomeA.localeCompare(nomeB);
    }

    if (ordenacao === 'alfabetica_desc') {
      return nomeB.localeCompare(nomeA);
    }

    return 0;
  });

const totalPaginas = Math.ceil(
  jogosFiltrados.length / ITENS_POR_PAGINA
);

const indiceInicial =
  (paginaAtual - 1) * ITENS_POR_PAGINA;

const indiceFinal =
  indiceInicial + ITENS_POR_PAGINA;

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
          usuarioLogado={usuarioLogado}
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
                  <small>Jogos adquiridos</small>
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
                  <small>Conquistas</small>
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
                  <small>Tempo jogado</small>
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
             onChange={(e) => {
              setBusca(e.target.value);
              setPaginaAtual(1);
                  }}
                 />
              <span className="meusjogos-search-icon">🔍</span>
            </div>
         
            <div className="Ordena"> 
              <label>Ordenar Por:</label>  
            <select
  value={ordenacao}
  onChange={(e) => {
    setOrdenacao(e.target.value);
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
              <p>Carregando jogos...</p>
            ) : jogosFiltrados.length === 0 ? (
              <p>
                Nenhum jogo encontrado.
              </p>
            ) : (
             jogosPaginados.map((game, index) => (
                <div
                  className="meusjogos-game-card"
                  key={index}
                >
                  <div className="meusjogos-game-info">
                    <h3>
                      {game.jogo?.nome}
                    </h3>

                    <div className="meusjogos-platforms">
                      <img
                        src={windowsIcon}
                        alt="Windows"
                      />
                    </div>

                    <p>
                      <strong>Chave:</strong>
                      <br />
                      {game.chaveAtivacao}
                    </p>
                  </div>

                  <div className="meusjogos-game-buttons">
                    <button className="meusjogos-btn-game">
                      Jogar
                    </button>

                    <button className="meusjogos-btn-info"
                     onClick={() => navigate('/detalhejogo')}
                    >
                      Sobre o jogo
                    </button>

                   
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPaginas > 0 && (
  <div className="meusjogos-pagination">

  {paginaAtual > 1 && (
  <button
    className="meusjogos-page-circle"
    onClick={() =>
      setPaginaAtual(paginaAtual - 1)
    }
  >
    ‹
  </button>
)}

    {Array.from(
      { length: totalPaginas },
      (_, index) => (
        <button
          key={index}
          className={`meusjogos-page-circle ${
            paginaAtual === index + 1
              ? 'meusjogos-active'
              : ''
          }`}
          onClick={() =>
            setPaginaAtual(index + 1)
          }
        >
          {index + 1}
        </button>
      )
    )}

   {paginaAtual < totalPaginas && (
  <button
    className="meusjogos-page-circle"
    onClick={() =>
      setPaginaAtual(paginaAtual + 1)
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