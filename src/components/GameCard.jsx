import '../styles/gamecard.css';

function GameCard({ jogo }){

   return(

      <div className="game-card">

        <img src={jogo.imagem} 
        alt={jogo.nome} 
        />

         <div className="game-info">

            <span className="preco">
               R$ {jogo.preco}
            </span>

            <button>
               + Carrinho
            </button>

         </div>

         <p>{jogo.nome}</p>

      </div>

   )

}

export default GameCard;