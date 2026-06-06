import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import logo from "../assets/logo.png";
import pix from "../assets/pix.jpg";
import boleto from "../assets/boleto.png";
import credito from "../assets/cred.png";
import suporte from "../assets/fone.png";

import "../styles/Finalizarpagamento.css";

function Pagamento() {
  const navigate = useNavigate();

  const [metodoPagamento, setMetodoPagamento] = useState("cartao");

  async function finalizarCompra() {
    try {
      const response = await api.post("/checkout");

      localStorage.setItem(
        "ultimaVenda",
        JSON.stringify(response.data.venda)
      );

      navigate("/compra-aprovada");
    } catch (error) {
      console.error(error);
      alert("Erro ao finalizar compra");
    }
  }

  return (
    <>
      <Navbar />

      <main className="payment-page">
        <section className="payment-left">
          <div className="page-title">
            <h1>Finalizar pagamento</h1>
            <p>Preencha os dados abaixo para concluir sua compra.</p>
          </div>

          <div className="card">
            <div className="card-title">Dados do pagamento</div>

            <div className="form-group">
              <label>Nome no cartão</label>
              <input
                type="text"
                placeholder="Nome completo"
              />
            </div>

            <div className="form-group">
              <label>Número do cartão</label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
              />
            </div>

            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                placeholder="123"
              />
            </div>

            <div className="row">
              <div className="form-group">
                <label>Validade</label>
                <select>
                  <option>Mês</option>
                </select>
              </div>

              <div className="form-group">
                <label>&nbsp;</label>
                <select>
                  <option>Ano</option>
                </select>
              </div>

              <div className="form-group">
                <label>Parcelamento</label>
                <select>
                  <option>1x de R$ 94,90</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              Método de pagamento
            </div>

            <div className="payment-methods">
              <label className="method">
                <input
                  type="radio"
                  checked={metodoPagamento === "cartao"}
                  onChange={() =>
                    setMetodoPagamento("cartao")
                  }
                />
                Cartão de crédito
              </label>

              <img src={credito} alt="Cartão" />

              <label className="method">
                <input
                  type="radio"
                  checked={metodoPagamento === "pix"}
                  onChange={() =>
                    setMetodoPagamento("pix")
                  }
                />
                Pix
              </label>

              <img src={pix} alt="Pix" />

              <label className="method">
                <input
                  type="radio"
                  checked={metodoPagamento === "boleto"}
                  onChange={() =>
                    setMetodoPagamento("boleto")
                  }
                />
                Boleto
              </label>

              <img src={boleto} alt="Boleto" />
            </div>
          </div>

          <div className="payment-button">
            <button onClick={finalizarCompra}>
              Pagar agora
            </button>

            <div className="secure-text">
              Ambiente 100% seguro e protegido.
            </div>
          </div>
        </section>

        <aside className="payment-right">
          <div className="card">
            <div className="card-title">
              Resumo do pedido
            </div>

            {/* Aqui você pode mostrar os jogos do carrinho */}
          </div>

          {metodoPagamento === "pix" && (
            <div className="card pix-box">
              <div className="card-title">
                Pague com Pix
              </div>

              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GameNestPagamento"
                alt="QR Code Pix"
              />

              <p>
                Escaneie o QR Code com o app do seu banco.
              </p>
            </div>
          )}

          <div className="card">
            <div className="support-box">
              <img
                src={suporte}
                alt="Suporte"
                className="support-icon"
              />

              <div>
                <h3>Precisa de ajuda?</h3>
                <a href="#">Abrir chamado.</a>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}

export default Pagamento;