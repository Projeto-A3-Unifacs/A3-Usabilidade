import GameCard from './GameCard';

import '../styles/gamesection.css';

function GameSection({ titulo, jogos }){

   return(

      <section className="game-section">

         <div className="section-top">

            <h2>{titulo}</h2>

            <a href="#">
               Ver mais
            </a>

         </div>

         <div className="games-row">

            {

               jogos.map((jogo) => (

                  <GameCard
                     key={jogo.id}
                     jogo={jogo}
                  />

               ))

            }

         </div>

      </section>

   )

}

export default GameSection;