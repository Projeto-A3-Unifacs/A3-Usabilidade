import Navbar from '../components/Navbar';
import Rodape from '../components/Rodape';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/stylecarrinho.css";
import logo from '../assets/logodois.png';

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

  const fetchCarrinho = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); 
        return;
      }
    setUsuarioLogado(true);
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
          const jogoResp = await axios.get(`https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/jogos/${item.fkJogo}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return { ...jogoResp.data, itemId: item.id, selecionado: true };
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
    <div>
      <header>
        <img src={logo} alt="Logo Game Nest" className="logo" />
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
                <input type="checkbox" checked={item.selecionado} onChange={() => toggleSelecionado(item.itemId)} className="select-game" />
                <img src={item.imagem} alt={item.nome} className="game-img" />
                <div className="game-info">
                  <h3>{item.nome}</h3>
                  <p>{item.genero}</p>
                </div>
                <span className="game-price">R$ {Number(item.preco).toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p>Seu carrinho está vazio.</p>
          )}

          <div className="summary-card">
            <h3>Resumo do pedido</h3>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>R$ {total}</span>
            </div>
          </div>
        </section>

        <aside className="sidebar">
          <button className="btn-pay"
          onClick={() => navigate("/pagamento")}
          >Seguir para pagamento
            
          </button>
        </aside>
      </main>

      <Rodape logo={logo} />
    </div>
  );
}

export default Carrinho;