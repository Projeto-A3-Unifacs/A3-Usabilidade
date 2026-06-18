import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import axios from "axios";

import cadeado from "../assets/cadeado.png";
import logo from "../assets/logodois.png";
import pix from "../assets/pix.jpg";
import boleto from "../assets/boleto.png";
import credito from "../assets/cartao.png";
import suporte from "../assets/fone.png";

import "../styles/Finalizarpagamento.css";

function Pagamento() {
  const navigate = useNavigate();

  const [metodoPagamento, setMetodoPagamento] = useState("cartao");
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");

  const [nomeCartao, setNomeCartao] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [cvv, setCvv] = useState("");
  const [validadeMes, setValidadeMes] = useState("");
  const [validadeAno, setValidadeAno] = useState("");
  const [parcelas, setParcelas] = useState(1); 
  const [jogosCarrinho, setJogosCarrinho] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
   const token = localStorage.getItem("token");

  useEffect(() => {
  if (token) {
    setUsuarioLogado(true);
    carregarCarrinho();
  }
}, [token]);
async function carregarCarrinho() {
  try {
    const carrinhoResponse = await axios.get(
      "https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/carrinho/ativo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const itens = carrinhoResponse.data.carrinho.itens || [];

   const jogos = await Promise.all(
  itens.map(async (item) => {
    const jogoResponse = await axios.get(
      `https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/jogos/${item.fkJogo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return jogoResponse.data;
  })
);

setJogosCarrinho(jogos);

const total = jogos.reduce(
  (soma, jogo) => soma + Number(jogo.preco),
  0
);

setValorTotal(total);
  } catch (error) {
    console.error("Erro ao carregar carrinho:", error);
  }
}
  function logout() {
    localStorage.removeItem("token");
    setUsuarioLogado(false);
    navigate("/");
  }

  async function finalizarCompra() {
    try {
      
      await axios.post(
        "https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/vendas/pay",
        {
          metodo: metodoPagamento
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const checkoutResponse = await axios.post(
        "https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/vendas/checkout",
        {}, // O corpo vai vazio, pois o seu back-end já sabe quem é o usuário pelo Token
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

     
      localStorage.setItem(
        "ultimaVenda",
        JSON.stringify(checkoutResponse.data.venda)
      );

      navigate("/compraaprovada");

    } catch (error) {
      console.error(error);
     setMensagemModal(
        error.response?.data?.message || "Erro ao processar pagamento ou finalizar compra."
      );
      setModalAberto(true);
    }
  }

  return (
    <>
      <header>
        <img src={logo} alt="Logo Game Nest" className="logo" />

        <Navbar
          usuarioLogado={usuarioLogado}
          logout={logout}
        />
      </header>

      <main className="payment-page">
        <section className="payment-left">
          <div className="page-title">
            <div className="titulo">
              <img
                className="cadeado"
                src={cadeado}
                alt="Cadeado"
              />
              <h1>Finalizar pagamento</h1>
            </div>

            <p>
              Preencha os dados abaixo para concluir sua compra.
            </p>
          </div>

          <div className="card">
            <div className="card-title">
              Dados do pagamento
            </div>

            <div className="form-group">
              <label>Nome no cartão</label>
              <input
                type="text"
                placeholder="Nome completo"
                value={nomeCartao}
                onChange={(e) =>
                  setNomeCartao(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Número do cartão</label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={numeroCartao}
                onChange={(e) =>
                  setNumeroCartao(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value)
                }
              />
            </div>

            <div className="row">
              <div className="form-group">
                <label>Validade</label>

                <select
                  value={validadeMes}
                  onChange={(e) =>
                    setValidadeMes(e.target.value)
                  }
                >
                  <option value="">Mês</option>
                  <option value="01">01</option>
                  <option value="02">02</option>
                  <option value="03">03</option>
                  <option value="04">04</option>
                  <option value="05">05</option>
                  <option value="06">06</option>
                  <option value="07">07</option>
                  <option value="08">08</option>
                  <option value="09">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>

              <div className="form-group">
                <label>&nbsp;</label>

                <select
                  value={validadeAno}
                  onChange={(e) =>
                    setValidadeAno(e.target.value)
                  }
                >
                  <option value="">Ano</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                </select>
              </div>

             <div className="form-group">
                <label>Parcelamento</label>
                <select 
                  value={parcelas} 
                  onChange={(e) => setParcelas(Number(e.target.value))}
                >
                  {valorTotal > 0 ? (
                    Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
                      const valorParcela = valorTotal / num;
                      return (
                        <option key={num} value={num}>
                          {num}x de R$ {valorParcela.toFixed(2).replace('.', ',')} sem juros
                        </option>
                      );
                    })
                  ) : (
                    <option value="1">1x sem juros</option>
                  )}
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

              <img
                src={credito}
                alt="Cartão de crédito"
              />

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
          <div className="card custom-summary-card">
            <div className="summary-header">
              Resumo do pedido
            </div>

            {jogosCarrinho.length === 0 ? (
              <p className="empty-cart">Nenhum jogo no carrinho.</p>
            ) : (
              <>
                <div className="summary-items-container">
                  {jogosCarrinho.map((jogo) => (
                    <div key={jogo.id} className="summary-game-item">
                      <div className="game-item-details">
                        <h3 className="game-item-title">{jogo.nome}</h3>
                        <p className="game-item-company">{jogo.empresa || "Empresa não informada"}</p>
                      </div>

                      <strong className="game-item-price">
                        R$<br/>{Number(jogo.preco).toFixed(2).replace('.', ',')}
                      </strong>
                    </div>
                  ))}
                </div>

                <hr className="summary-divider" />

                <div className="summary-total-line">
                  <span className="total-label">Total</span>
                  <span className="total-value">
                    R$ {valorTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </>
            )}
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
                Escaneie o QR Code com o aplicativo do seu
                banco.
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
                <a href="#">Abrir chamado</a>
              </div>
            </div>
          </div>
        </aside>
      </main>
    {/* --- CÓDIGO DO MODAL DE ERRO --- */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-custom-content">
            <div className="modal-icon">⚠️</div>
            <h3>Atenção</h3>
            <p>{mensagemModal}</p>
            <button 
              className="btn-close-modal" 
              onClick={() => setModalAberto(false)}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

    </>
  );
}

export default Pagamento;