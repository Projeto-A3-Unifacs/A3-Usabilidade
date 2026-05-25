import '../styles/gamecard.css';

function GameCard({ jogo }){

   return(

      <div className="game-card">

    <div className="imagem-container">

        <img src={jogo.imagem} />

        <span className="preco">
            R$ {jogo.preco}
        </span>

        <button className="btn-carrinho">
            + Carrinho
        </button>

    </div>

    <p>{jogo.nome}</p>

</div>

   )

}

export default GameCard;