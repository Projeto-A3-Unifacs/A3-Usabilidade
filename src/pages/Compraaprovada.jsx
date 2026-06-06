import "../styles/compraaprovada.css";
import "../styles/style.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import fone from "../assets/fone.png";
import cartao from "../assets/cartao.png";
import download from "../assets/download.png";
import logo from "../assets/logodois.png";

function CompraAprovada() {
  const navigate = useNavigate();

  const [usuarioLogado, setUsuarioLogado] = useState(false);

  const token = localStorage.getItem("token");

  const venda = JSON.parse(
    localStorage.getItem("ultimaVenda")
  );

  useEffect(() => {
    if (token) {
      setUsuarioLogado(true);
    }
  }, [token]);

  function logout() {
    localStorage.removeItem("token");
    setUsuarioLogado(false);
    navigate("/");
  }

  return (
    <div className="compra-aprovada">
      <div className="topo">
        <Navbar
          usuarioLogado={usuarioLogado}
          logout={logout}
        />

        <img
          src={logo}
          alt="Logo Game Nest"
          className="logo"
        />
      </div>

      <main className="purchase-container">
        <section className="success-area">
          <div className="success-circle">✓</div>
          <h1>Compra aprovada!</h1>
          <p>Seu pagamento foi confirmado com sucesso.</p>
        </section>

        <section className="purchase-card">
          <div className="purchase-info">
            <div className="info-box">
              <span>Valor</span>
              <strong>
                {venda
                  ? venda.valorTotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "R$ 0,00"}
              </strong>
            </div>

            <div className="info-box">
              <span>Quantidade</span>
              <strong>
                {venda ? venda.quantidade : 0}
              </strong>
            </div>

            <div className="info-box">
              <span>Data e hora</span>
              <strong>
                {venda
                  ? new Date(venda.data).toLocaleString("pt-BR")
                  : "-"}
              </strong>
            </div>
          </div>

          <div className="success-alert">
            <p>O jogo já está disponível na sua biblioteca.</p>
            <span>Acesse agora e comece a jogar!</span>
          </div>

          <div className="buttons">
            <button
              className="btn btn-library"
              onClick={() => navigate("/biblioteca")}
            >
              Ir para minha biblioteca
            </button>

            <button
              className="btn btn-store"
              onClick={() => navigate("/loja")}
            >
              Continuar comprando
            </button>
          </div>
        </section>

        <section className="benefits">
          <div className="benefit-card">
            <img
              src={download}
              alt="Download"
              className="benefit-icon"
            />

            <div>
              <h3>Download ilimitado</h3>
              <p>Baixe seus jogos quando quiser.</p>
            </div>
          </div>

          <div className="benefit-card">
            <img
              src={cartao}
              alt="Pagamento"
              className="benefit-icon"
            />

            <div>
              <h3>Pagamento seguro</h3>
              <p>Seus dados protegidos com segurança.</p>
            </div>
          </div>

          <div className="benefit-card">
            <img
              src={fone}
              alt="Suporte"
              className="benefit-icon"
            />

            <div>
              <h3>Suporte dedicado</h3>
              <p>Conte com nossa equipe sempre que precisar.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CompraAprovada;