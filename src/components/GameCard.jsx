import '../styles/gamecard.css';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function GameCard({ jogo }) {
  const navigate = useNavigate();

  function verJogo() {
    if (!jogo?.id) {
      console.error('O jogo não possui ID:', jogo);

      toast.error(
        'Não foi possível abrir os detalhes do jogo.'
      );

      return;
    }

    navigate(`/detalhejogo/${jogo.id}`);
  }

  async function adicionarAoCarrinho(event) {
    /*
      Impede que algum clique no botão seja interpretado
      como clique no card.
    */
    event.stopPropagation();

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login', {
          replace: true
        });

        return;
      }

      const resposta = await axios.post(
        'https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/carrinho/add',
        {
          jogoId: jogo.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(resposta.data);

      toast.success(
        'Jogo adicionado ao carrinho!'
      );
    } catch (erro) {
      console.error(
        'Erro ao adicionar ao carrinho:',
        erro.response?.data || erro.message
      );

      if (erro.response?.status === 401) {
        localStorage.removeItem('token');

        toast.error(
          'Sua sessão expirou. Faça login novamente.'
        );

        navigate('/login', {
          replace: true
        });

        return;
      }

      toast.error(
        erro.response?.data?.message ||
          'Não foi possível adicionar o jogo ao carrinho.'
      );
    }
  }

  return (
    <div className="game-card">
      <div className="imagem-container">
        <img
          src={jogo.imagem}
          alt={jogo.nome}
          onClick={verJogo}
          style={{ cursor: 'pointer' }}
        />

        <span className="preco">
          {Number(jogo.preco).toLocaleString(
            'pt-BR',
            {
              style: 'currency',
              currency: 'BRL'
            }
          )}
        </span>

        <button
          type="button"
          className="btn-carrinho"
          onClick={adicionarAoCarrinho}
        >
          + Carrinho
        </button>
      </div>

      <p
        className="game-title"
        onClick={verJogo}
        style={{ cursor: 'pointer' }}
      >
        {jogo.nome}
      </p>
    </div>
  );
}

export default GameCard;