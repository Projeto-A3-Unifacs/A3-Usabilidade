<div>
  <header>
    <img
      src="imagens/logo.png"
      alt="Logo Game Nest"
      className="logo"
    />

    <nav>
      <a href="#">Página Inicial</a>
      <a href="#">Explorar</a>
      <a href="#">Carrinho</a>
      <a href="#">Biblioteca</a>
      <a href="#" className="perfil-link">
        Perfil
      </a>
      <a href="#">Sair</a>
    </nav>
  </header>

  <div className="container">
    <aside className="sidebar">
      <ul>
        <li>
          <a href="#">Editar perfil</a>
        </li>

        <li>
          <a href="#" className="active">
            Alterar senha
          </a>
        </li>

        <li>
          <a href="#">Lista de desejos</a>
        </li>

        <li>
          <a href="#">Jogos comprados</a>
        </li>

        <li>
          <a href="#">Ajuda</a>
        </li>
      </ul>
    </aside>

    <main className="main-content">
      <div className="card user-card">
        <img
          src="imagens/perfil.png"
          alt="Avatar"
          className="avatar"
        />

        <div className="user-info">
          <h2>Adailton Cerqueira</h2>
          <p>a*********@gmail.com</p>
        </div>

        <button type="button" className="btn btn-edit">
          <img
            src="imagens/lapis.png"
            alt="Editar"
            className="edit-icon"
          />
          Editar
        </button>
      </div>

      <div className="title-section">
        <img
          src="imagens/cadeado.png"
          alt="Segurança"
          className="icon"
        />

        <h2>Alterar senha</h2>

        <p>
          Atualize sua senha para manter sua conta segura.
        </p>
      </div>

      <div className="form-cards">
        <div className="card alter-senha-card">
          <form>
            <div className="form-group">
              <label htmlFor="senha-atual">
                Senha atual
              </label>

              <input
                type="password"
                id="senha-atual"
                name="senhaAtual"
                placeholder="Digite sua senha atual"
              />
            </div>

            <div className="form-group">
              <label htmlFor="nova-senha">
                Nova senha
              </label>

              <input
                type="password"
                id="nova-senha"
                name="novaSenha"
                placeholder="Digite sua nova senha"
              />

              <small className="strength">
                Força da senha:{" "}
                <span className="fraca">fraca</span>
              </small>

              <ul className="requirements">
                <li>Mínimo de 8 caracteres</li>
                <li>Uma letra maiúscula</li>
                <li>Uma letra minúscula</li>
                <li>Um número</li>
                <li>Um caractere especial</li>
              </ul>
            </div>

            <div className="form-group">
              <label htmlFor="confirmar-senha">
                Confirmar senha
              </label>

              <input
                type="password"
                id="confirmar-senha"
                name="confirmarSenha"
                placeholder="Repita a nova senha"
              />
            </div>

            <div className="buttons center-buttons">
              <button
                type="button"
                className="btn btn-cancel"
              >
                Voltar
              </button>

              <button
                type="submit"
                className="btn btn-save"
              >
                Salvar nova senha
              </button>
            </div>
          </form>
        </div>

        <div className="card security-tips-card">
          <h3>
            <img
              src="imagens/escudo.png"
              alt="Escudo"
              className="shield-icon"
            />
            Dicas de segurança
          </h3>

          <ul>
            <li>
              <div className="tip-box">
                <img
                  src="imagens/cadeado.png"
                  alt=""
                />
                Nunca compartilhe a sua senha.
              </div>
            </li>

            <li>
              <div className="tip-box">
                <img
                  src="imagens/documento.png"
                  alt=""
                />
                Evite usar datas de nascimento.
              </div>
            </li>

            <li>
              <div className="tip-box">
                <img
                  src="imagens/aleatorio.png"
                  alt=""
                />
                Use combinações diferentes para cada conta.
              </div>
            </li>

            <li>
              <div className="tip-box">
                <img
                  src="imagens/tempo.png"
                  alt=""
                />
                Altere sua senha periodicamente.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>

  <footer>
    <img
      src="imagens/logo.png"
      alt="Logo Game Nest Footer"
    />

    <span>
      © 2026 Arcade Corporation. Todos os direitos reservados.
      Todas as marcas registradas são propriedade de seus
      respectivos donos no Brasil e em outros países.
    </span>
  </footer>
</div>