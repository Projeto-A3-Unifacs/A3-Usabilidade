import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer
} from "recharts";

import { getToken, isAuthenticated, logoutUser } from "../utils/auth";
import "../styles/Dashboard.css";

import padrao from "../assets/games/padrao.png";

const dataCategoria = [
  { name: "Ação", value: 400 }, { name: "Aventura", value: 300 },
  { name: "Estratégia", value: 150 }, { name: "Guerra", value: 200 }, { name: "FPS", value: 250 }
];
const COLORS = ["#7B61FF", "#FF9B70", "#48CDB3", "#F2C94C", "#56CCF2"];

const dataVendas = [
  { name: "Jan", vendas: 100 }, { name: "Fev", vendas: 300 },
  { name: "Mar", vendas: 600 }, { name: "Abr", vendas: 1800 }, { name: "Mai", vendas: 5500 }
];

const dataAcessos = [
  { name: "Jan", acessos: 500 }, { name: "Fev", acessos: 1500 },
  { name: "Mar", acessos: 3000 }, { name: "Abr", acessos: 3500 }, { name: "Mai", acessos: 4800 }
];

function Dashboard() {
  const navigate = useNavigate();
  const [topJogosGeral, setTopJogosGeral] = useState([]);
  const [topJogosEmpresa, setTopJogosEmpresa] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    carregarDadosIniciais();
  }, [navigate]);

  useEffect(() => {
    if (empresaSelecionada) {
      carregarTopJogosEmpresa(empresaSelecionada);
    } else {
      setTopJogosEmpresa([]);
    }
  }, [empresaSelecionada]);

  function logout() {
    logoutUser();
    navigate("/login");
  }

  async function carregarDadosIniciais() {
    setCarregando(true);
    const token = getToken();
    try {
      const resGeral = await axios.get(
        "https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/relatorios/jogos-mais-vendidos?top=10",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTopJogosGeral(resGeral.data || []);

      const resEmpresas = await axios.get(
        "https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/empresas",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmpresas(resEmpresas.data || []);
      
      if (resEmpresas.data && resEmpresas.data.length > 0) {
        setEmpresaSelecionada(resEmpresas.data[0].id || resEmpresas.data[0].id_empresa);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setCarregando(false);
    }
  }

  async function carregarTopJogosEmpresa(empresaId) {
    const token = getToken();
    try {
      const response = await axios.get(
        `https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/relatorios/jogos-mais-vendidos?top=10&empresa=${empresaId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTopJogosEmpresa(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar top jogos da empresa:", error);
      setTopJogosEmpresa([]);
    }
  }

  const calcularReceitaMock = (totalVendas) => {
    const vendas = Number(totalVendas) || 0;
    const precoFicticio = 89.90;
    const receita = vendas * precoFicticio;
    return receita.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <h3 className="painel">Painel administrativo</h3>
        <nav>
          <a href="/dashboard" className="active">Dashboard</a>
          <a href="/paineljogo">Gerenciar jogos</a>
          <a href="/paineladm">Gerenciar empresas</a>
          <a href="/perfil">Perfil</a>
          <a href="#sair" onClick={logout}>Sair</a>
        </nav>
      </header>

      <main className="dash-container">
        <div className="dash-title-section">
          <div>
            <h1>Dashboard</h1>
            <p>Acompanhe o desempenho da plataforma e visualize os principais indicadores.</p>
          </div>
          <div className="dash-date-picker">
            📅 01/01/2026 - 20/05/2026 ⌄
          </div>
        </div>

        <section className="dash-kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon bag">🛍️</div>
            <div className="kpi-info">
              <span className="kpi-label">Total de vendas</span>
              <strong className="kpi-value text-purple">R$ 124.780,56</strong>
              <span className="kpi-trend up">↗ 10,6% vs. período anterior</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon game">🎮</div>
            <div className="kpi-info">
              <span className="kpi-label">Jogos vendidos</span>
              <strong className="kpi-value text-purple">2.458</strong>
              <span className="kpi-trend up">↗ 12,4% vs. período anterior</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon users">👥</div>
            <div className="kpi-info">
              <span className="kpi-label">Usuários ativos</span>
              <strong className="kpi-value text-purple">1.326</strong>
              <span className="kpi-trend up">↗ 9,8% vs. período anterior</span>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon views">👁️</div>
            <div className="kpi-info">
              <span className="kpi-label">Total de acessos</span>
              <strong className="kpi-value text-purple">12.864</strong>
              <span className="kpi-trend up">↗ 21,3% vs. período anterior</span>
            </div>
          </div>
        </section>

        <section className="dash-charts-grid">
          <div className="chart-card">
            <h3>Categoria mais jogada</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={dataCategoria} innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                    {dataCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-legends">
                {dataCategoria.map((cat, i) => (
                  <span key={i}><span className="dot" style={{ backgroundColor: COLORS[i] }}></span>{cat.name}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Vendas 2026</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dataVendas}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip />
                  <Line type="monotone" dataKey="vendas" stroke="#7B61FF" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3>Quantidade de acessos</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dataAcessos}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip />
                  <Bar dataKey="acessos" fill="#7B61FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="dash-tables-grid">
          <div className="table-card">
            <h3>Top 10 jogos mais vendidos</h3>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Jogo</th>
                  <th>Empresa</th>
                  <th>Vendas</th>
                  <th>Receita</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr><td colSpan="5">Carregando...</td></tr>
                ) : topJogosGeral.length === 0 ? (
                  <tr><td colSpan="5">Sem dados suficientes.</td></tr>
                ) : (
                  topJogosGeral.map((jogo, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="game-name-col">
                        <img src={padrao} alt="jogo" />
                        {jogo.nome}
                      </td>
                      <td>{jogo.empresa}</td>
                      <td>{jogo.total}</td>
                      <td>{calcularReceitaMock(jogo.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="table-footer-btn">
              <button>Ver todos os jogos</button>
            </div>
          </div>

          <div className="table-card">
            <div className="table-card-header">
              <h3>Jogos mais vendidos da minha empresa</h3>
              <select value={empresaSelecionada} onChange={(e) => setEmpresaSelecionada(e.target.value)}>
                <option value="">Selecione...</option>
                {empresas.map((emp) => (
                  <option key={emp.id || emp.id_empresa} value={emp.id || emp.id_empresa}>
                    {emp.nome}
                  </option>
                ))}
              </select>
            </div>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Jogo</th>
                  <th>Empresa</th>
                  <th>Vendas</th>
                  <th>Receita</th>
                </tr>
              </thead>
              <tbody>
                {topJogosEmpresa.length === 0 ? (
                  <tr><td colSpan="5">Sem dados para esta empresa.</td></tr>
                ) : (
                  topJogosEmpresa.map((jogo, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="game-name-col">
                        <img src={padrao} alt="jogo" />
                        {jogo.nome}
                      </td>
                      <td>{jogo.empresa}</td>
                      <td>{jogo.total}</td>
                      <td>{calcularReceitaMock(jogo.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="table-footer-btn">
              <button>Ver todos os jogos da empresa</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;