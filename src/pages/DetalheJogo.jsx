import { useState } from 'react';
import Navbar from '../components/Navbar';
import Rodape from '../components/Rodape';
import styles from '../styles/styledetalhe.module.css';

import logo from '../assets/logo.png';
import voltar from '../assets/voltar.png';
import jogoum from '../assets/games/jogoum.png';
import perfil from '../assets/perfil.png';
import {
  getToken,
  isAuthenticated
} from '../utils/auth';

function DetalheJogo() {
  const [comment, setComment] = useState('');
  const [usuarioLogado, setUsuarioLogado]= useState(false)
  const maxLength = 1000;




       

  

    function logout(){

      localStorage.removeItem('token');

      setUsuarioLogado(false);

      navigate('/');

   }

  const clearForm = () => setComment('');

  return (
    <div>
      <header className={styles.header}>
        <img src={logo} alt="Logo Game Nest" className={styles.logo} />
        <Navbar 
        usuarioLogado={usuarioLogado}
        logout={logout}
        />
      </header>

      <main className={styles.container}>
        <section className={styles.gameDetail}>
          <a href="/meusjogos" className={styles.backLink}>
            <img src={voltar} alt="Voltar" /> Voltar para o jogo
          </a>

          <div className={styles.gameTop}>
            <img src={jogoum} alt="Hollow Knight" className={styles.gameImg} />
            <div className={styles.gameInfo}>
              <h1>Hollow Knight</h1>
              <p className={styles.genre}>Ação e aventura</p>
              <p className={styles.description}>
                Hollow Knight é um aclamado jogo indie de ação-aventura estilo Metroidvania desenvolvido pela Team Cherry.
                Jogadores exploram o vasto e interconectado reino subterrâneo de Hallownest, habitado por insetos, enfrentando desafios intensos,
                desvendando mistérios e adquirindo novas habilidades em um mundo artístico desenhado à mão.
              </p>
              <p className={styles.exploration}>Exploração: Mundo vasto e interconectado para descobrir.</p>
            </div>
          </div>

          <div className={styles.reviewsSection}>
            {/* Avaliação */}
            <div className={styles.submitReview}>
              <h2>Avaliar o jogo</h2>
              <p>Compartilhe sua experiência com outros jogadores.</p>
              <label>Sua avaliação</label>
              <div className={styles.stars}>★★★★★ 5 de 5</div>
              <div className={styles.commentWrapper}>
                <textarea
                  className={styles.textarea}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comentário"
                  maxLength={maxLength}
                />
                <span className={styles.charCount}>{comment.length}/{maxLength}</span>
              </div>
              <p className={styles.guidelines}>Seja respeitoso e siga nossas diretrizes da comunidade.</p>
              <div className={styles.centeredSection}>
                <label>Data da avaliação</label>
                <input type="date" value="2025-05-20" className={styles.reviewDate} readOnly />
                <div className={styles.buttons}>
                  <button className={styles.btnClear} onClick={clearForm}>Limpar</button>
                  <button className={styles.btnSubmit}>Avaliar</button>
                </div>
              </div>
            </div>

            {/* Resumo Avaliações */}
            <div className={styles.summaryReview}>
              <h2>Resumo das avaliações</h2>
              <div className={styles.reviewSummaryGrid}>
                <div className={styles.avgSection}>
                  <p className={styles.average}>4,0</p>
                  <div className={styles.starsSummary}>★★★★☆</div>
                  <p className={styles.label}>média das avaliações</p>
                </div>
                <div className={styles.verticalSeparator}></div>
                <div className={styles.totalSection}>
                  <p className={styles.total}>128</p>
                  <p className={styles.label}>Total de avaliações</p>
                </div>
              </div>

              <div className={styles.ratingBar}>
                <div className={styles.ratingLine}>
                  <span className={styles.labelLeft}>5 estrelas</span>
                  <div className={styles.bar}><div className={styles.fill} style={{width:'68%'}}></div></div>
                  <span className={styles.labelRight}>87 (68%)</span>
                </div>
                <div className={styles.ratingLine}>
                  <span className={styles.labelLeft}>4 estrelas</span>
                  <div className={styles.bar}><div className={styles.fill} style={{width:'22%'}}></div></div>
                  <span className={styles.labelRight}>28 (22%)</span>
                </div>
                <div className={styles.ratingLine}>
                  <span className={styles.labelLeft}>3 estrelas</span>
                  <div className={styles.bar}><div className={styles.fill} style={{width:'6%'}}></div></div>
                  <span className={styles.labelRight}>8 (6%)</span>
                </div>
                <div className={styles.ratingLine}>
                  <span className={styles.labelLeft}>2 estrelas</span>
                  <div className={styles.bar}><div className={styles.fill} style={{width:'2%'}}></div></div>
                  <span className={styles.labelRight}>3 (2%)</span>
                </div>
                <div className={styles.ratingLine}>
                  <span className={styles.labelLeft}>1 estrela</span>
                  <div className={styles.bar}><div className={styles.fill} style={{width:'2%'}}></div></div>
                  <span className={styles.labelRight}>2 (2%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Avaliações jogadores */}
          <div className={styles.gameReviews}>
            <h2>Avaliações do jogo</h2>

            <div className={styles.review}>
              <img src={perfil} alt="Adailton Cerqueira" />
              <div className={styles.reviewInfo}>
                <h3>Adailton Cerqueira</h3>
                <div className={styles.stars}>★★★★★</div>
                <p>Simplesmente um dos melhores jogos.</p>
              </div>
              <div className={styles.reviewMeta}>
                <span className={styles.reviewDatec}>20/05/2025 às 14:32</span>
                <span className={styles.reviewMenu}>⋮</span>
              </div>
            </div>

            <div className={styles.review}>
              <img src={perfil} alt="Bala Mansa" />
              <div className={styles.reviewInfo}>
                <h3>Bala Mansa</h3>
                <div className={styles.stars}>★★★★☆</div>
                <p>Joguei bem pouco, mas me diverti.</p>
              </div>
              <div className={styles.reviewMeta}>
                <span className={styles.reviewDatec}>15/05/2025 às 13:15</span>
                <span className={styles.reviewMenu}>⋮</span>
              </div>
            </div>

          </div>

          <div className={styles.pagination}>
            <button className={styles.pageBtn}>&lt;</button>
            <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
            <button className={styles.pageBtn}>2</button>
            <button className={styles.pageBtn}>&gt;</button>
          </div>
        </section>
      </main>

      <Rodape logo={logo} />
    </div>
  );
}

export default DetalheJogo;