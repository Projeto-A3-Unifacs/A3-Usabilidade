import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { getToken } from "../utils/auth";

import logo from "../assets/logodois.png";
import perfil from "../assets/perfil.png";

import "../styles/styleeditarperfil.css";

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
    id:
      dados?.id ||
      dados?.usuarioId ||
      dados?.userId ||
      null,

    nome:
      dados?.nome ||
      dados?.name ||
      "",

    dataNascimento:
      dados?.data_nascimento ||
      dados?.dataNascimento ||
      "",

    fkPerfil:
      dados?.fkPerfil ||
      dados?.fk_perfil ||
      null,
  };
}

function separarData(dataNascimento) {
  if (!dataNascimento) {
    return {
      dia: "",
      mes: "",
      ano: "",
    };
  }

  const dataTexto = String(dataNascimento);

  const formatoBrasileiro = dataTexto.match(
    /^(\d{2})\/(\d{2})\/(\d{4})$/
  );

  if (formatoBrasileiro) {
    return {
      dia: formatoBrasileiro[1],
      mes: formatoBrasileiro[2],
      ano: formatoBrasileiro[3],
    };
  }

  const formatoBanco = dataTexto.match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (formatoBanco) {
    return {
      dia: formatoBanco[3],
      mes: formatoBanco[2],
      ano: formatoBanco[1],
    };
  }

  const data = new Date(dataNascimento);

  if (Number.isNaN(data.getTime())) {
    return {
      dia: "",
      mes: "",
      ano: "",
    };
  }

  return {
    dia: String(data.getUTCDate()).padStart(2, "0"),
    mes: String(data.getUTCMonth() + 1).padStart(2, "0"),
    ano: String(data.getUTCFullYear()),
  };
}

function atualizarUsuarioLocalStorage(novoNome) {
  const chaves = ["usuario", "user"];

  chaves.forEach((chave) => {
    const valorSalvo = localStorage.getItem(chave);

    if (!valorSalvo) {
      return;
    }

    try {
      const dados = JSON.parse(valorSalvo);

      if (dados.usuario) {
        dados.usuario.nome = novoNome;
      } else if (dados.user) {
        dados.user.nome = novoNome;
      } else if (
        dados.data &&
        typeof dados.data === "object"
      ) {
        dados.data.nome = novoNome;
      } else {
        dados.nome = novoNome;
      }

      localStorage.setItem(
        chave,
        JSON.stringify(dados)
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar usuário salvo:",
        error
      );
    }
  });
}

function EditarPerfil() {
  const navigate = useNavigate();

  const [usuarioId, setUsuarioId] = useState(null);
  const [nome, setNome] = useState("");
  const [diaNascimento, setDiaNascimento] = useState("");
  const [mesNascimento, setMesNascimento] = useState("");
  const [anoNascimento, setAnoNascimento] = useState("");
  const [fkPerfil, setFkPerfil] = useState(null);

  const [carregandoUsuario, setCarregandoUsuario] =
    useState(true);

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const dias = useMemo(() => {
    return Array.from(
      { length: 31 },
      (_, indice) =>
        String(indice + 1).padStart(2, "0")
    );
  }, []);

  const meses = useMemo(
    () => [
      { valor: "01", nome: "Janeiro" },
      { valor: "02", nome: "Fevereiro" },
      { valor: "03", nome: "Março" },
      { valor: "04", nome: "Abril" },
      { valor: "05", nome: "Maio" },
      { valor: "06", nome: "Junho" },
      { valor: "07", nome: "Julho" },
      { valor: "08", nome: "Agosto" },
      { valor: "09", nome: "Setembro" },
      { valor: "10", nome: "Outubro" },
      { valor: "11", nome: "Novembro" },
      { valor: "12", nome: "Dezembro" },
    ],
    []
  );

  const anos = useMemo(() => {
    const anoAtual = new Date().getFullYear();

    return Array.from(
      { length: anoAtual - 1899 },
      (_, indice) => String(anoAtual - indice)
    );
  }, []);

  useEffect(() => {
    let componenteAtivo = true;

    async function carregarUsuario() {
      try {
        setCarregandoUsuario(true);

        const id = obterIdUsuarioLogado();

        if (!id) {
          throw new Error(
            "Não foi possível identificar o usuário conectado."
          );
        }

        const response = await api.get(
          `${USUARIOS_PATH}/${id}`
        );

        if (!componenteAtivo) {
          return;
        }

        if (
          response.status === 204 ||
          !response.data
        ) {
          throw new Error("Usuário não encontrado.");
        }

        const usuario = normalizarUsuario(
          response.data
        );

        const dataSeparada = separarData(
          usuario.dataNascimento
        );

        setUsuarioId(id);
        setNome(usuario.nome);
        setDiaNascimento(dataSeparada.dia);
        setMesNascimento(dataSeparada.mes);
        setAnoNascimento(dataSeparada.ano);
        setFkPerfil(usuario.fkPerfil);
      } catch (error) {
        console.error(
          "Erro ao carregar perfil:",
          error
        );

        if (!componenteAtivo) {
          return;
        }

        const mensagemErro =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Não foi possível carregar o perfil.";

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

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("usuario");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");

    navigate("/login");
  }

  function cancelar() {
    navigate(-1);
  }

  async function salvarPerfil(event) {
    event.preventDefault();

    setMensagem("");
    setTipoMensagem("");

    if (!nome.trim()) {
      setMensagem("Informe o nome do usuário.");
      setTipoMensagem("erro");
      return;
    }

    if (
      !diaNascimento ||
      !mesNascimento ||
      !anoNascimento
    ) {
      setMensagem(
        "Informe a data de nascimento completa."
      );
      setTipoMensagem("erro");
      return;
    }

    if (!usuarioId) {
      setMensagem(
        "Não foi possível identificar o usuário."
      );
      setTipoMensagem("erro");
      return;
    }

    const dataNascimento =
      `${diaNascimento}/${mesNascimento}/${anoNascimento}`;

    try {
      setSalvando(true);

      const dadosAtualizados = {
        nome: nome.trim(),
        dataNascimento,
      };

      if (fkPerfil) {
        dadosAtualizados.fkPerfil = fkPerfil;
      }

      const response = await api.put(
        `${USUARIOS_PATH}/${usuarioId}`,
        dadosAtualizados
      );

      atualizarUsuarioLocalStorage(nome.trim());

      setMensagem(
        response.data?.message ||
          "Perfil atualizado com sucesso!"
      );

      setTipoMensagem("sucesso");
    } catch (error) {
      console.error(
        "Erro ao atualizar perfil:",
        error
      );

      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Não foi possível atualizar o perfil.";

      setMensagem(mensagemErro);
      setTipoMensagem("erro");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="pagina-editar-perfil">
      <header>
        <Link to="/">
          <img
            src={logo}
            alt="Logo Game Nest"
            className="logo"
          />
        </Link>

        <nav>
          <Link to="/">
            Página Inicial
          </Link>

          <Link to="/explorar">
            Explorar
          </Link>

          <Link to="/carrinho">
            Carrinho
          </Link>

          <Link to="/biblioteca">
            Biblioteca
          </Link>

          <Link to="/perfil">
            Perfil
          </Link>

          <button
            type="button"
            className="nav-sair"
            onClick={sair}
          >
            Sair
          </button>
        </nav>
      </header>

      <div className="container">
        <aside className="sidebar">
          <ul>
            <li>
              <Link
                to="/editarperfil"
                className="active"
              >
                Editar perfil
              </Link>
            </li>

            <li>
              <Link to="/alterarsenha">
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
          <div className="card">
            <h2>
              <img
                src={perfil}
                alt="Avatar"
                className="avatar"
              />

              Editar perfil
            </h2>

            <p>
              Atualize suas informações pessoais.
            </p>

            <hr className="divider" />

            {mensagem && (
              <div
                className={`mensagem-feedback ${tipoMensagem}`}
                role="alert"
                aria-live="polite"
              >
                {mensagem}
              </div>
            )}

            <form onSubmit={salvarPerfil}>
              <div className="form-group">
                <label htmlFor="nome">
                  Nome
                </label>

                <input
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Digite seu nome"
                  value={nome}
                  onChange={(event) =>
                    setNome(event.target.value)
                  }
                  disabled={
                    carregandoUsuario ||
                    salvando
                  }
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
                    value={diaNascimento}
                    onChange={(event) =>
                      setDiaNascimento(
                        event.target.value
                      )
                    }
                    disabled={
                      carregandoUsuario ||
                      salvando
                    }
                  >
                    <option value="">
                      Dia
                    </option>

                    {dias.map((dia) => (
                      <option
                        key={dia}
                        value={dia}
                      >
                        {dia}
                      </option>
                    ))}
                  </select>

                  <select
                    id="mes-nascimento"
                    name="mesNascimento"
                    value={mesNascimento}
                    onChange={(event) =>
                      setMesNascimento(
                        event.target.value
                      )
                    }
                    aria-label="Mês de nascimento"
                    disabled={
                      carregandoUsuario ||
                      salvando
                    }
                  >
                    <option value="">
                      Mês
                    </option>

                    {meses.map((mes) => (
                      <option
                        key={mes.valor}
                        value={mes.valor}
                      >
                        {mes.nome}
                      </option>
                    ))}
                  </select>

                  <select
                    id="ano-nascimento"
                    name="anoNascimento"
                    value={anoNascimento}
                    onChange={(event) =>
                      setAnoNascimento(
                        event.target.value
                      )
                    }
                    aria-label="Ano de nascimento"
                    disabled={
                      carregandoUsuario ||
                      salvando
                    }
                  >
                    <option value="">
                      Ano
                    </option>

                    {anos.map((ano) => (
                      <option
                        key={ano}
                        value={ano}
                      >
                        {ano}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <hr className="divider" />

              <div className="buttons">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={cancelar}
                  disabled={salvando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn btn-save"
                  disabled={
                    carregandoUsuario ||
                    salvando
                  }
                >
                  {salvando
                    ? "Salvando..."
                    : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <footer>
        <Link to="/">
          <img
            src={logo}
            alt="Logo Game Nest Footer"
          />
        </Link>

        <span>
          © 2026 Arcade Corporation. Todos os direitos
          reservados. Todas as marcas registradas são
          propriedade de seus respectivos donos no Brasil
          e em outros países.
        </span>
      </footer>
    </div>
  );
}

export default EditarPerfil;