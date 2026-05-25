import GameCard from './GameCard';

import '../styles/gamesection.css';


function GameSection({ titulo, icone, jogos }){

   return(

      <section className="game-section">

         <div className="section-top">

            <img
               src={icone}
               className="icone-section"
            />

            <h2>{titulo}</h2>

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