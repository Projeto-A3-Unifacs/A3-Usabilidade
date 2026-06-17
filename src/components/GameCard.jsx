import '../styles/gamecard.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function GameCard({ jogo }){
    const navigate =
useNavigate();
    

   return(

      <div className="game-card">

    <div className="imagem-container">

        <img src={jogo.imagem}
          onClick={verJogo}
        />

        <span className="preco">
            R$ {jogo.preco}
        </span>

        <button className="btn-carrinho"
          onClick={adicionarAoCarrinho}
        >
            + Carrinho
        </button>

    </div>

    <p className="game-title">{jogo.nome}</p>

    


</div>

   )

  function verJogo(){
   navigate("/detalhejogo")

  }




   async function adicionarAoCarrinho(){
   
    try{

      const token =
         localStorage.getItem(
            'token'
         );

      if(!token){

        navigate('/login')

         return;

      }

      const resposta =
         await axios.post(

            'https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/carrinho/add',

            {

               jogoId:
                  jogo.id

            },

            {

               headers:{

                  Authorization:
                     `Bearer ${token}`

               }

            }

         );

      console.log(
         resposta.data
      );

      toast.success(
'Jogo adicionado ao carrinho!'

);

   }catch(erro){

      console.log(erro);

      toast.error(
         erro.response?.data?.message
      );

   }

   }

}

export default GameCard;