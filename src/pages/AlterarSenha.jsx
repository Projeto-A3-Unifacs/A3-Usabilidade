import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { getToken } from "../utils/auth";

import logo from "../assets/logodois.png";
import perfil from "../assets/perfil.png";
import lapis from "../assets/lapis.png";
import cadeado from "../assets/cadeado.png";
import escudo from "../assets/escudo.png";
import documento from "../assets/documento.png";
import aleatorio from "../assets/aleatorio.png";
import tempo from "../assets/tempo.png";
import Navbar from '../components/Navbar';

import "../styles/stylealterarsenha.css";

const CHANGE_PASSWORD_PATH = "/auth/change-password";
const USUARIOS_PATH = "/usuarios";

function decodificarToken(token) {
  try {
    if (!token) {
      return null;
    }

    const tokenLimpo = token.replace(/^Bearer\s+/i, "");
    const partes = tokenLimpo.split(".");

    if (partes.length !== 3) {
      return null;
    }

    const payloadBase64 = partes[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payloadFormatado = payloadBase64.padEnd(
      Math.ceil(payloadBase64.length / 4) * 4,
      "="
    );

    const payloadDecodificado = decodeURIComponent(
      window
        .atob(payloadFormatado)
        .split("")
        .map((caractere) => {
          const hexadecimal = caractere
            .charCodeAt(0)
            .toString(16)
            .padStart(2, "0");

          return `%${hexadecimal}`;
        })
        .join("")
    );

    return JSON.parse(payloadDecodificado);
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
}

function obterIdUsuarioLogado() {
  const usuarioSalvo =
    localStorage.getItem("usuario") ||
    localStorage.getItem("user");

  if (usuarioSalvo) {
    try {
      const dados = JSON.parse(usuarioSalvo);

      const usuario =
        dados.usuario ||
        dados.user ||
        dados.data ||
        dados;

      const idSalvo =
        usuario.id ||
        usuario.usuarioId ||
        usuario.userId ||
        usuario.idUsuario;

      if (idSalvo) {
        return idSalvo;
      }
    } catch (error) {
      console.error("Erro ao ler usuário salvo:", error);
    }
  }

  const token = getToken();
  const payload = decodificarToken(token);

  if (!payload) {
    return null;
  }

  return (
    payload.id ||
    payload.usuarioId ||
    payload.userId ||
    payload.idUsuario ||
    payload.sub ||
    null
  );
}

function normalizarUsuario(resposta) {
  let dados =
    resposta?.usuario ||
    resposta?.user ||
    resposta?.data ||
    resposta;

  if (Array.isArray(dados)) {
    dados = dados[0];
  }

  return {
    nome:
      dados?.nome ||
      dados?.name ||
      "Usuário",

    email:
      dados?.email ||
      dados?.usuarioEmail ||
      "",
  };
}

function mascararEmail(email) {
  if (!email || !email.includes("@")) {
    return "E-mail não informado";
  }

  const [nome, dominio] = email.split("@");

  if (!nome || !dominio) {
    return email;
  }

  const quantidadeAsteriscos = Math.max(
    nome.length - 1,
    5
  );

  return `${nome.charAt(0)}${"*".repeat(
    quantidadeAsteriscos
  )}@${dominio}`;
}

function limparDadosAutenticacao() {
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authToken");
  localStorage.removeItem("usuario");
  localStorage.removeItem("user");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("usuario");
  sessionStorage.removeItem("user");
}

function AlterarSenha() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
  });

  const [carregandoUsuario, setCarregandoUsuario] =
    useState(true);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] =
    useState("");

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] =
    useState("");

  const requisitos = useMemo(
    () => ({
      tamanho: novaSenha.length >= 8,
      maiuscula: /[A-Z]/.test(novaSenha),
      minuscula: /[a-z]/.test(novaSenha),
      numero: /[0-9]/.test(novaSenha),
      especial: /[^A-Za-z0-9]/.test(novaSenha),
    }),
    [novaSenha]
  );

  const forcaSenha = useMemo(() => {
    if (!novaSenha) {
      return {
        texto: "não informada",
        classe: "fraca",
      };
    }

    const totalAtendido = Object.values(
      requisitos
    ).filter(Boolean).length;

    if (totalAtendido <= 2) {
      return {
        texto: "fraca",
        classe: "fraca",
      };
    }

    if (totalAtendido <= 4) {
      return {
        texto: "média",
        classe: "media",
      };
    }

    return {
      texto: "forte",
      classe: "forte",
    };
  }, [novaSenha, requisitos]);

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarUsuario() {
      try {
        setCarregandoUsuario(true);

        const usuarioId = obterIdUsuarioLogado();

        if (!usuarioId) {
          throw new Error(
            "Não foi possível identificar o usuário conectado."
          );
        }

        const response = await api.get(
          `${USUARIOS_PATH}/${usuarioId}`
        );

        if (!componenteAtivo) {
          return;
        }

        if (
          response.status === 204 ||
          !response.data
        ) {
          throw new Error(
            "Usuário não encontrado."
          );
        }

        const usuarioEncontrado =
          normalizarUsuario(response.data);

        setUsuario({
          nome: usuarioEncontrado.nome,
          email: usuarioEncontrado.email,
        });
      } catch (error) {
        console.error(
          "Erro ao carregar usuário:",
          error
        );

        if (!componenteAtivo) {
          return;
        }

        const mensagemErro =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Não foi possível carregar o usuário.";

        setMensagem(mensagemErro);
        setTipoMensagem("erro");
      } finally {
        if (componenteAtivo) {
          setCarregandoUsuario(false);
        }
      }
    }

    carregarUsuario();

    return () => {
      componenteAtivo = false;
    };
  }, []);

  function limparFormulario() {
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  }

  function voltar() {
    navigate(-1);
  }

  function editarPerfil() {
    navigate("/editarperfil");
  }

  function sair() {
    limparDadosAutenticacao();
    navigate("/login");
  }

  async function alterarSenha(event) {
    event.preventDefault();

    setMensagem("");
    setTipoMensagem("");

    if (
      !senhaAtual ||
      !novaSenha ||
      !confirmarSenha
    ) {
      setMensagem("Preencha todos os campos.");
      setTipoMensagem("erro");
      return;
    }

    const senhaValida = Object.values(
      requisitos
    ).every(Boolean);

    if (!senhaValida) {
      setMensagem(
        "A nova senha não atende a todos os requisitos."
      );
      setTipoMensagem("erro");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem(
        "A confirmação está diferente da nova senha."
      );
      setTipoMensagem("erro");
      return;
    }

    if (senhaAtual === novaSenha) {
      setMensagem(
        "A nova senha deve ser diferente da senha atual."
      );
      setTipoMensagem("erro");
      return;
    }

    try {
      setSalvando(true);

      const response = await api.put(
        CHANGE_PASSWORD_PATH,
        {
          currentPassword: senhaAtual,
          newPassword: novaSenha,
        }
      );

      setMensagem(
        response.data?.message ||
          "Senha alterada com sucesso!"
      );

      setTipoMensagem("sucesso");
      limparFormulario();
    } catch (error) {
      console.error(
        "Erro ao alterar senha:",
        error
      );

      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Não foi possível alterar a senha.";

      setMensagem(mensagemErro);
      setTipoMensagem("erro");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="pagina-alterar-senha">
      <header>
        <Link
          to="/"
          className="logo-link"
          aria-label="Ir para a página inicial"
        >
          <img
            src={logo}
            alt="Logo Game Nest"
            className="logo"
          />
        </Link>

        {/* Navbar inserida no lugar do elemento nav */}
        <Navbar usuarioLogado={true} logout={sair} />
      </header>

      <div className="container">
        <aside className="sidebar">
          <ul>
            <li>
              <Link to="/editarperfil">
                Editar perfil
              </Link>
            </li>

            <li>
              <Link
                to="/alterarsenha"
                className="active"
              >
                Alterar senha
              </Link>
            </li>

            <li>
              <Link to="/listadedesejos">
                Lista de desejos
              </Link>
            </li>

            <li>
              <Link to="/historico">
                Jogos comprados
              </Link>
            </li>

            <li>
              <Link to="/ajuda">
                Ajuda
              </Link>
            </li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="card user-card">
            <img
              src={perfil}
              alt="Avatar do usuário"
              className="avatar"
            />

            <div className="user-info">
              <h2>
                {carregandoUsuario
                  ? "Carregando..."
                  : usuario.nome}
              </h2>

              <p>
                {carregandoUsuario
                  ? "Buscando e-mail..."
                  : mascararEmail(usuario.email)}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-edit"
              onClick={editarPerfil}
            >
              <img
                src={lapis}
                alt=""
                className="edit-icon"
              />

              Editar
            </button>
          </div>

          <div className="title-section">
            <img
              src={cadeado}
              alt=""
              className="icon"
            />

            <h2>Alterar senha</h2>

            <p>
              Atualize sua senha para manter sua
              conta segura.
            </p>
          </div>

          {mensagem && (
            <div
              className={`mensagem-feedback ${tipoMensagem}`}
              role="alert"
              aria-live="polite"
            >
              {mensagem}
            </div>
          )}

          <div className="form-cards">
            <div className="card alter-senha-card">
              <form onSubmit={alterarSenha}>
                <div className="form-group">
                  <label htmlFor="senha-atual">
                    Senha atual
                  </label>

                  <input
                    type="password"
                    id="senha-atual"
                    name="senhaAtual"
                    placeholder="Digite sua senha atual"
                    value={senhaAtual}
                    onChange={(event) =>
                      setSenhaAtual(
                        event.target.value
                      )
                    }
                    autoComplete="current-password"
                    disabled={salvando}
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
                    value={novaSenha}
                    onChange={(event) =>
                      setNovaSenha(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                    disabled={salvando}
                  />

                  <small className="strength">
                    Força da senha:{" "}
                    <span
                      className={forcaSenha.classe}
                    >
                      {forcaSenha.texto}
                    </span>
                  </small>

                  <ul className="requirements">
                    <li
                      className={
                        requisitos.tamanho
                          ? "requisito-valido"
                          : ""
                      }
                    >
                      Mínimo de 8 caracteres
                    </li>

                    <li
                      className={
                        requisitos.maiuscula
                          ? "requisito-valido"
                          : ""
                      }
                    >
                      Uma letra maiúscula
                    </li>

                    <li
                      className={
                        requisitos.minuscula
                          ? "requisito-valido"
                          : ""
                      }
                    >
                      Uma letra minúscula
                    </li>

                    <li
                      className={
                        requisitos.numero
                          ? "requisito-valido"
                          : ""
                      }
                    >
                      Um número
                    </li>

                    <li
                      className={
                        requisitos.especial
                          ? "requisito-valido"
                          : ""
                      }
                    >
                      Um caractere especial
                    </li>
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
                    value={confirmarSenha}
                    onChange={(event) =>
                      setConfirmarSenha(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                    disabled={salvando}
                  />

                  {confirmarSenha &&
                    confirmarSenha !==
                      novaSenha && (
                      <small className="senhas-diferentes">
                        As senhas não coincidem.
                      </small>
                    )}
                </div>

                <div className="buttons center-buttons">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={voltar}
                    disabled={salvando}
                  >
                    Voltar
                  </button>

                  <button
                    type="submit"
                    className="btn btn-save"
                    disabled={salvando}
                  >
                    {salvando
                      ? "Salvando..."
                      : "Salvar nova senha"}
                  </button>
                </div>
              </form>
            </div>

            <div className="card security-tips-card">
              <h3>
                <img
                  src={escudo}
                  alt=""
                  className="shield-icon"
                />

                Dicas de segurança
              </h3>

              <ul>
                <li>
                  <div className="tip-box">
                    <img
                      src={cadeado}
                      alt=""
                    />

                    Nunca compartilhe a sua senha.
                  </div>
                </li>

                <li>
                  <div className="tip-box">
                    <img
                      src={documento}
                      alt=""
                    />

                    Evite usar datas de nascimento.
                  </div>
                </li>

                <li>
                  <div className="tip-box">
                    <img
                      src={aleatorio}
                      alt=""
                    />

                    Use combinações diferentes para
                    cada conta.
                  </div>
                </li>

                <li>
                  <div className="tip-box">
                    <img
                      src={tempo}
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
        <Link
          to="/"
          className="logo-link"
          aria-label="Ir para a página inicial"
        >
          <img
            src={logo}
            alt="Logo Game Nest"
          />
        </Link>

        <span>
          © 2026 Arcade Corporation. Todos os
          direitos reservados. Todas as marcas
          registradas são propriedade de seus
          respectivos donos no Brasil e em outros
          países.
        </span>
      </footer>
    </div>
  );
}

export default AlterarSenha;