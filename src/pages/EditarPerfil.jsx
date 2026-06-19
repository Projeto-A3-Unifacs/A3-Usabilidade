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
      <a href="#">Perfil</a>
      <a href="#">Sair</a>
    </nav>
  </header>

  <div className="container">
    <aside className="sidebar">
      <ul>
        <li>
          <a href="#" className="active">
            Editar perfil
          </a>
        </li>

        <li>
          <a href="#">Alterar senha</a>
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
      <div className="card">
        <h2>
          <img
            src="imagens/perfil.png"
            alt="Avatar"
            className="avatar"
          />

          Editar perfil
        </h2>

        <p>Atualize suas informações pessoais.</p>

        <hr className="divider" />

        <form>
          <div className="form-group">
            <label htmlFor="nome">
              Nome
            </label>

            <input
              type="text"
              id="nome"
              name="nome"
              defaultValue="Adailton Cerqueira"
            />

            <p className="helper-text">
              Este será o nome exibido no seu perfil.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="dia-nascimento">
              Data de nascimento
            </label>

            <div className="date-group">
              <select
                id="dia-nascimento"
                name="diaNascimento"
                defaultValue="20"
              >
                <option value="20">
                  20
                </option>
              </select>

              <select
                id="mes-nascimento"
                name="mesNascimento"
                defaultValue="05"
                aria-label="Mês de nascimento"
              >
                <option value="05">
                  Maio
                </option>
              </select>

              <select
                id="ano-nascimento"
                name="anoNascimento"
                defaultValue="1995"
                aria-label="Ano de nascimento"
              >
                <option value="1995">
                  1995
                </option>
              </select>
            </div>
          </div>

          <hr className="divider" />

          <div className="buttons">
            <button
              type="button"
              className="btn btn-cancel"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-save"
            >
              Salvar alterações
            </button>
          </div>
        </form>
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