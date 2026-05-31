import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/stylemeusjogos.css';
import Navbar from '../components/Navbar';
import Rodape from '../components/Rodape';
import logo from '../assets/logodois.png';
import controle from '../assets/controle.png';
import medalha from '../assets/medalha.png';
import relogio from '../assets/relogio.png';
import lupa from '../assets/lupa.png';
import windowsIcon from '../assets/windows.png';
import playstationIcon from '../assets/playstation.png';
import xboxIcon from '../assets/xbox.png';

function MeusJogos() {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJogos() {
      try {
        const response = await axios.get(
          'https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/usuarios/my/games',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        const validJogos = response.data?.filter(game => game && game.nome && game.id);
        setJogos(validJogos || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setJogos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchJogos();
  }, []);

  // Calcula somatórios ou 0 se vazio
  const totalJogos = jogos.length || 0;
  const totalConquistas = jogos.reduce((acc, game) => acc + (game.conquistas || 0), 0) || 0;
  const totalTempo = jogos.reduce((acc, game) => acc + (game.tempoJogado || 0), 0) || 0;

  return (
    <div className="meusjogos-container">
      <header className="meusjogos-header">
        <img src={logo} alt="Logo Game Nest" className="meusjogos-logo" />
        <Navbar />
      </header>

      <main className="meusjogos-container-principal">
        <section className="meusjogos-games-section">
          <div className="meusjogos-header-top">
            <h2 className="meusjogos-page-title">Meus Jogos</h2>

            {/* Cards de Resumo sempre visíveis */}
            <div className="meusjogos-summary-cards">
              <div className="meusjogos-summary-card-small">
                <img src={controle} alt="Jogos adquiridos" />
                <span>{totalJogos}<br /><small>Jogos adquiridos</small></span>
              </div>
              <div className="meusjogos-summary-card-small">
                <img src={medalha} alt="Conquistas" />
                <span>{totalConquistas}<br /><small>Conquistas</small></span>
              </div>
              <div className="meusjogos-summary-card-small">
                <img src={relogio} alt="Tempo de jogo" />
                <span>{totalTempo}h<br /><small>Tempo jogado</small></span>
              </div>
            </div>
          </div>

          <p className="meusjogos-paragrafo">
            {error
              ? `Erro: ${error}`
              : totalJogos === 0
              ? "Você não possui jogos."
              : "Confira todos os jogos que você possui na sua biblioteca."}
          </p>

          <div className="meusjogos-search-filters">
            <div className="meusjogos-search-box">
              <input type="text" placeholder="Buscar jogos..." />
              <img src={lupa} alt="Buscar" className="meusjogos-search-icon" />
            </div>
            <select>
              <option value="todas">Plataforma: Todas</option>
              <option value="windows">Windows</option>
              <option value="playstation">PlayStation</option>
              <option value="xbox">Xbox</option>
            </select>
            <select>
              <option value="todos">Status: Todos</option>
              <option value="completo">Completo</option>
              <option value="em_andamento">Em andamento</option>
            </select>
            <select>
              <option value="recentes">Ordenar por: Mais recentes</option>
              <option value="alfabetico">Ordem alfabética</option>
            </select>
          </div>

          <div className="meusjogos-games-grid">
            {loading ? (
              <p>Carregando jogos...</p>
            ) : totalJogos === 0 ? (
              <p>Você não possui jogos.</p>
            ) : (
              jogos.map((game, index) => (
                <div className="meusjogos-game-card" key={index}>
                  <img
                    src={game.imagem || '/assets/games/default.png'}
                    alt={game.nome}
                    className="meusjogos-game-img"
                  />
                  <div className="meusjogos-game-info">
                    <h3>{game.nome}</h3>
                    <div className="meusjogos-platforms">
                      {game.plataformas?.includes('Windows') && <img src={windowsIcon} alt="Windows" />}
                      {game.plataformas?.includes('PlayStation') && <img src={playstationIcon} alt="PlayStation" />}
                      {game.plataformas?.includes('Xbox') && <img src={xboxIcon} alt="Xbox" />}
                    </div>
                    <p>Tempo jogado: {game.tempoJogado || 0}h</p>
                  </div>
                  <div className="meusjogos-game-buttons">
                    <button className="meusjogos-btn-game">Jogar</button>
                    <button className="meusjogos-btn-info">Sobre o jogo</button>
                    <button className="meusjogos-btn-remove">Remover</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="meusjogos-pagination">
            <button className="meusjogos-page-btn">&lt;</button>
            <button className="meusjogos-page-btn meusjogos-active">1</button>
            <button className="meusjogos-page-btn">2</button>
            <button className="meusjogos-page-btn">&gt;</button>
          </div>
        </section>
      </main>

      <Rodape logo={logo} />
    </div>
  );
}

export default MeusJogos;