import Navbar from '../components/Navbar';
import Rodape from '../components/Rodape';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/stylecarrinho.css";
import logo from '../assets/logo.png';
import padrao from '../assets/games/padrao.png';
import controle from '../assets/controle.png';
import {
  getToken,
  isAuthenticated
} from '../utils/auth';
function Carrinho() {
  const [carrinho, setCarrinho] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [usuarioLogado, setUsuarioLogado] = useState(false);

   function logout(){

      localStorage.removeItem('token');

      setUsuarioLogado(false);

      navigate('/');

   }


  
   const removerDoCarrinho = async (gameId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/carrinho/${gameId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchCarrinho();

  } catch (error) {
    console.error("Erro ao remover jogo:", error);
  }
};




  const fetchCarrinho = async () => {
    try {
      const autenticado = isAuthenticated();
      
                   setUsuarioLogado(autenticado);
      
                    if (!autenticado) {
                      navigate('/login');
                      }
     const token = getToken();
      const response = await axios.get('https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/carrinho/ativo', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const itensCarrinho = response.data.carrinho.itens || [];

      if (itensCarrinho.length === 0) {
        setCarrinho([]);
        setTotal(0);
        return;
      }

const jogosDetalhes = await Promise.all(
  itensCarrinho.map(async (item) => {

    const jogoResp = await axios.get(
      `https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/jogos/${item.fkJogo}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const jogo = jogoResp.data;

    const categoriaResp = await axios.get(
      `https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/categorias/${jogo.fkCategoria}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const empresaResp = await axios.get(
      `https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/empresas/${jogo.fkEmpresa}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return {
      ...jogo,
      categoria: categoriaResp.data.nome.trim(),
      empresa: empresaResp.data.nome.trim(),
      itemId: item.id,
      selecionado: true
    };
  })
);
      
      setCarrinho(jogosDetalhes);

      const valorTotal = jogosDetalhes.reduce(
        (acc, jogo) => acc + (jogo.selecionado ? Number(jogo.preco) : 0),
        0
      );
      setTotal(valorTotal.toFixed(2));

    } catch (error) {
      console.error('Erro ao buscar carrinho ou jogos:', error);
      setCarrinho([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchCarrinho();
  }, []);

  const toggleSelecionado = (id) => {
    const novoCarrinho = carrinho.map(jogo => {
      if (jogo.itemId === id) jogo.selecionado = !jogo.selecionado;
      return jogo;
    });
    setCarrinho(novoCarrinho);

    const valorTotal = novoCarrinho.reduce((acc, jogo) => acc + (jogo.selecionado ? Number(jogo.preco) : 0), 0);
    setTotal(valorTotal.toFixed(2));
  };

  return (
    <div className="carrinho">
      <header>
        <img src={logo} alt="Logo Game Nest" className="logo"  
         onClick={() => navigate("/")}
        />
        <Navbar 
        usuarioLogado={usuarioLogado}
        logout={logout}
        />
      </header>

     <main className="container">
  <section className="cart-section">
    <h2 className="page-title">Carrinho de compras</h2>
    <p>Revise seus itens antes de finalizar a compra.</p>

    {carrinho.length > 0 ? (
      carrinho.map((item) => (
        <div className="cart-item" key={item.itemId}>
          <img
            src={padrao}
            alt={item.nome}
            className="game-img"
          />

          <div className="game-info">
            <h3>{item.nome}</h3>

              <p>
               {item.categoria} • {item.empresa}
                 </p>

                 <p>
                  {item.descricao.split('"')}
                 </p>
               </div>
          <div className="item-actions">
            <span className="game-price">
              R$ {Number(item.preco).toFixed(2)}
            </span>

            <div className="item-options">

              <button className="btn-trash"
                onClick={() => removerDoCarrinho(item.id)}
              >
                
                🗑️
              </button>
            </div>

            <button 
              className="btn-game"
              onClick={() => navigate(`/detalhejogo/${item.id}`)}
            >
              Sobre o jogo
            </button>
          </div>
        </div>
      ))
    ) : (
      <p>Seu carrinho está vazio.</p>
    )}

    <div className="suggestion-card">
       <div className="game-placeholder">🎮</div>

      <div className="suggestion-text">
        <p>Seu próximo jogo pode estar aqui!</p>
        <small>
          Explore nossa loja e descubra novas aventuras.
        </small>
      </div>

      <button
        className="btn-explore"
        onClick={() => navigate("/")}
      >
        Explorar loja →
      </button>
    </div>

    <div className="suggestion-card">
      <div className="game-placeholder">🎮</div>

      <div className="suggestion-text">
        <p>Novidades esperando por você</p>
        <small>
          Confira os lançamentos mais recentes.
        </small>
      </div>

      <button
        className="btn-explore"
        onClick={() => navigate("/")}
      >
        Ver jogos →
      </button>
    </div>
  </section>

  <aside className="sidebar">
    <div className="summary-card">
      <h3>Resumo do pedido</h3>

      <div className="summary-line">
        <span>
          Itens selecionados (
          {
            carrinho.filter(
              item => item.selecionado
            ).length
          }
          )
        </span>

        <span>R$ {total}</span>
      </div>

      <hr />

      <div className="summary-line">
        <span>Subtotal</span>
        <span>R$ {total}</span>
      </div>

      <hr />

      <div className="summary-line total">
        <span>Total</span>
        <span>R$ {total}</span>
      </div>

      <button
        className="btn-pay"
        onClick={() => navigate("/pagamento")}
      >
        Seguir para pagamento
      </button>

      <div className="security-note">
        🔒 Ambiente 100% seguro
      </div>
    </div>

    <div className="benefits-card">
      <h3>Por que comprar na Game Nest?</h3>

      <div className="benefit">
        <div>⚡</div>

        <div className="benefit-text">
          <strong>Entrega imediata</strong>
          <span>
            Seus jogos chegam instantaneamente.
          </span>
        </div>
      </div>

      <div className="benefit">
        <div>🛡️</div>

        <div className="benefit-text">
          <strong>Compra segura</strong>
          <span>
            Ambiente protegido e confiável.
          </span>
        </div>
      </div>

      <div className="benefit">
        <div>🎧</div>

        <div className="benefit-text">
          <strong>Suporte dedicado</strong>
          <span>
            Atendimento sempre disponível.
          </span>
        </div>
      </div>

      <div className="benefit">
        <div>💳</div>

        <div className="benefit-text">
          <strong>Pagamento facilitado</strong>
          <span>
            Pix, cartão e outras opções.
          </span>
        </div>
      </div>
    </div>
  </aside>
</main>

      <Rodape logo={logo} />
    </div>
  );
}

export default Carrinho;