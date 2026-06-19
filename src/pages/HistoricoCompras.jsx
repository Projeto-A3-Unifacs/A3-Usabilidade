import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Rodape from "../components/Rodape";
import logo from "../assets/logodois.png";

import { getToken, isAuthenticated, logoutUser } from "../utils/auth";
import "../styles/HistoricoCompras.css";

function HistoricoCompras() {
    
  const navigate = useNavigate();
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  
  const [ordenacao, setOrdenacao] = useState("recentes");
  const [paginaAtual, setPaginaAtual] = useState(1);
  
  const ITENS_POR_PAGINA = 4;

  useEffect(() => {
    async function carregarHistorico() {
      const autenticado = isAuthenticated();
      setUsuarioLogado(autenticado);

      if (!autenticado) {
        navigate("/login");
        return;
      }

      const token = getToken();

      try {
        setCarregando(true);
        const response = await axios.get(
          "https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/vendas/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVendas(response.data || []);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        setErro("Não foi possível carregar seu histórico de compras.");
      } finally {
        setCarregando(false);
      }
    }

    carregarHistorico();
  }, [navigate]);

  function logout() {
    logoutUser();
    setUsuarioLogado(false);
    navigate("/");
  }

  
  const vendasOrdenadas = useMemo(() => {
    return [...vendas].sort((a, b) => {
      if (ordenacao === "recentes") {
        return new Date(b.data) - new Date(a.data);
      }
      if (ordenacao === "antigas") {
        return new Date(a.data) - new Date(b.data);
      }
      if (ordenacao === "maior_valor") {
        return Number(b.valorTotal) - Number(a.valorTotal);
      }
      if (ordenacao === "menor_valor") {
        return Number(a.valorTotal) - Number(b.valorTotal);
      }
      return 0;
    });
  }, [vendas, ordenacao]);

  const totalPaginas = Math.max(1, Math.ceil(vendasOrdenadas.length / ITENS_POR_PAGINA));
  const vendasPaginadas = vendasOrdenadas.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const dataFormatada = data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const horaFormatada = data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return (
      <>
        {dataFormatada} <br /> {horaFormatada}
      </>
    );
  };

  return (
    <div className="historico-page">
      <header>
        <img
          src={logo}
          alt="Logo Game Nest"
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
        <Navbar usuarioLogado={usuarioLogado} logout={logout} />
      </header>

      <main className="historico-container">
        <section className="historico-header">
          <h1>Histórico de compras</h1>
          <p>Confira todas as suas compras realizadas.</p>

          <div className="historico-filtros">
            <label>Ordenar por: </label>
            <select
              value={ordenacao}
              onChange={(e) => {
                setOrdenacao(e.target.value);
                setPaginaAtual(1); // Reseta a página ao mudar o filtro
              }}
            >
              <option value="recentes">Mais recentes</option>
              <option value="antigas">Mais antigas</option>
              <option value="maior_valor">Maior valor</option>
              <option value="menor_valor">Menor valor</option>
            </select>
          </div>
        </section>

        <section className="historico-lista-card">
          <div className="historico-titulos-coluna">
            <span>Valor total</span>
            <span>Quantidade</span>
            <span>Data da compra</span>
            <span className="coluna-icone"></span>
          </div>

          <div className="historico-itens">
            {carregando ? (
              <p className="historico-mensagem">Carregando compras...</p>
            ) : erro ? (
              <p className="historico-mensagem erro">{erro}</p>
            ) : vendasPaginadas.length === 0 ? (
              <p className="historico-mensagem">Nenhuma compra encontrada.</p>
            ) : (
              vendasPaginadas.map((venda) => (
                <div key={venda.id} className="historico-item">
                  <div className="historico-coluna valor">
                    R$ {Number(venda.valorTotal).toFixed(2).replace(".", ",")}
                  </div>
                  <div className="historico-coluna quantidade">
                    {venda.quantidade}
                  </div>
                  <div className="historico-coluna data">
                    {formatarData(venda.data)}
                  </div>
                  <div className="historico-coluna icone">
                    {/* SVG do ícone de recibo igual ao print */}
                    <svg width="24" height="28" viewBox="0 0 24 24" fill="none" stroke="#9b59b6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16c0 .5.5 1 1 1l2-1 2 1 2-1 2 1 2-1 2 1c.5 0 1-.5 1-1V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="8" y1="13" x2="16" y2="13"></line>
                      <line x1="8" y1="17" x2="16" y2="17"></line>
                      <line x1="10" y1="9" x2="14" y2="9"></line>
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Paginação */}
          {!carregando && totalPaginas > 1 && (
            <div className="historico-paginacao">
              <button
                className="btn-paginacao seta"
                onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                disabled={paginaAtual === 1}
              >
                ❮
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                <button
                  key={pagina}
                  className={`btn-paginacao ${paginaAtual === pagina ? "ativo" : ""}`}
                  onClick={() => setPaginaAtual(pagina)}
                >
                  {pagina}
                </button>
              ))}

              <button
                className="btn-paginacao seta"
                onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
                disabled={paginaAtual === totalPaginas}
              >
                ❯
              </button>
            </div>
          )}
        </section>
      </main>

      <Rodape logo={logo} />
    </div>
  );
}

export default HistoricoCompras;