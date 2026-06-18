import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../services/api";
import { logoutUser } from "../utils/auth";
import "../styles/PainelAdm.css";
import logo from '../assets/logo.png'
import Rodape from '../components/Rodape'
const EMPRESAS_ENDPOINT = "/empresas";
const EMPRESAS_POR_PAGINA = 4;



function obterIdEmpresa(empresa) {
  return (
    empresa?.id_empresa ??
    empresa?.empresa_id ??
    empresa?.id
  );
}


function normalizarEmpresas(dados) {
  if (Array.isArray(dados)) {
    return dados;
  }

  if (Array.isArray(dados?.empresas)) {
    return dados.empresas;
  }

  if (Array.isArray(dados?.data)) {
    return dados.data;
  }

  return [];
}

function obterMensagemErro(error, mensagemPadrao) {
  const status = error.response?.status;

  if (status === 401) {
    return "Sua sessão expirou ou o token foi recusado. Faça login novamente.";
  }

  if (status === 403) {
    return "Você não possui permissão de administrador para realizar esta operação.";
  }

  if (status === 404) {
    return "O endereço solicitado não foi encontrado na API.";
  }

  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    mensagemPadrao
  );
}

function PainelAdm() {
  const [empresas, setEmpresas] = useState([]);

  const [nomeNovaEmpresa, setNomeNovaEmpresa] =
    useState("");

  const [empresaEdicaoId, setEmpresaEdicaoId] =
    useState("");

  const [novoNomeEmpresa, setNovoNomeEmpresa] =
    useState("");

  const [empresaExclusaoId, setEmpresaExclusaoId] =
    useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);

  const [carregandoEmpresas, setCarregandoEmpresas] =
    useState(true);

  const [criandoEmpresa, setCriandoEmpresa] =
    useState(false);

  const [atualizandoEmpresa, setAtualizandoEmpresa] =
    useState(false);

  const [excluindoEmpresa, setExcluindoEmpresa] =
    useState(false);

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  function limparAvisos() {
    setMensagem("");
    setErro("");
  }

  /*
    GET /api/v1/empresas
  */
  const carregarEmpresas = useCallback(async () => {
    try {
      setCarregandoEmpresas(true);
      setErro("");

      const response = await api.get(
        EMPRESAS_ENDPOINT
      );

      if (response.status === 204) {
        setEmpresas([]);
        return;
      }

      const empresasRecebidas =
        normalizarEmpresas(response.data);

      setEmpresas(empresasRecebidas);
    } catch (error) {
      console.error(
        "Erro ao carregar empresas:",
        error
      );

      setEmpresas([]);

      setErro(
        obterMensagemErro(
          error,
          "Não foi possível carregar as empresas."
        )
      );
    } finally {
      setCarregandoEmpresas(false);
    }
  }, []);

  useEffect(() => {
    carregarEmpresas();
  }, [carregarEmpresas]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      empresas.length / EMPRESAS_POR_PAGINA
    )
  );

  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  }, [paginaAtual, totalPaginas]);

  const empresasPaginadas = useMemo(() => {
    const inicio =
      (paginaAtual - 1) * EMPRESAS_POR_PAGINA;

    const fim = inicio + EMPRESAS_POR_PAGINA;

    return empresas.slice(inicio, fim);
  }, [empresas, paginaAtual]);

  /*
    POST /api/v1/empresas
  */
  async function handleCriarEmpresa(event) {
    event.preventDefault();

    limparAvisos();

    const nome = nomeNovaEmpresa.trim();

    if (!nome) {
      setErro("Informe o nome da empresa.");
      return;
    }

    try {
      setCriandoEmpresa(true);

      await api.post(EMPRESAS_ENDPOINT, {
        nome,
      });

      setNomeNovaEmpresa("");
      setMensagem("Empresa criada com sucesso.");

      await carregarEmpresas();
    } catch (error) {
      console.error(
        "Erro ao criar empresa:",
        error
      );

      setErro(
        obterMensagemErro(
          error,
          "Não foi possível criar a empresa."
        )
      );
    } finally {
      setCriandoEmpresa(false);
    }
  }

  function handleSelecionarEmpresaEdicao(event) {
    limparAvisos();

    const idSelecionado = event.target.value;

    setEmpresaEdicaoId(idSelecionado);

    if (!idSelecionado) {
      setNovoNomeEmpresa("");
      return;
    }

    const empresaSelecionada = empresas.find(
      (empresa) =>
        String(obterIdEmpresa(empresa)) ===
        String(idSelecionado)
    );

    setNovoNomeEmpresa(
      empresaSelecionada?.nome || ""
    );
  }

  function handleEditarPelaTabela(empresa) {
    limparAvisos();

    const id = obterIdEmpresa(empresa);

    if (!id) {
      setErro(
        "Não foi possível identificar a empresa selecionada."
      );
      return;
    }

    setEmpresaEdicaoId(String(id));
    setNovoNomeEmpresa(empresa.nome || "");

    document
      .getElementById("editar-empresa")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  /*
    PUT /api/v1/empresas/:id
  */
  async function handleAtualizarEmpresa(event) {
    event.preventDefault();

    limparAvisos();

    const nome = novoNomeEmpresa.trim();

    if (!empresaEdicaoId) {
      setErro(
        "Selecione uma empresa para editar."
      );
      return;
    }

    if (!nome) {
      setErro(
        "Informe o novo nome da empresa."
      );
      return;
    }

    try {
      setAtualizandoEmpresa(true);

      await api.put(
        `${EMPRESAS_ENDPOINT}/${empresaEdicaoId}`,
        {
          nome,
        }
      );

      setEmpresaEdicaoId("");
      setNovoNomeEmpresa("");

      setMensagem(
        "Empresa atualizada com sucesso."
      );

      await carregarEmpresas();
    } catch (error) {
      console.error(
        "Erro ao atualizar empresa:",
        error
      );

      setErro(
        obterMensagemErro(
          error,
          "Não foi possível atualizar a empresa."
        )
      );
    } finally {
      setAtualizandoEmpresa(false);
    }
  }

  function handleCancelarEdicao() {
    setEmpresaEdicaoId("");
    setNovoNomeEmpresa("");
    limparAvisos();
  }

  /*
    DELETE /api/v1/empresas/:id
  */
  async function excluirEmpresa(id) {
    limparAvisos();

    if (!id) {
      setErro(
        "Selecione uma empresa para excluir."
      );
      return;
    }

    const empresaSelecionada = empresas.find(
      (empresa) =>
        String(obterIdEmpresa(empresa)) ===
        String(id)
    );

    const nomeEmpresa =
      empresaSelecionada?.nome ||
      "empresa selecionada";

    const confirmou = window.confirm(
      `Deseja realmente excluir a empresa "${nomeEmpresa}"?`
    );

    if (!confirmou) {
      return;
    }

    try {
      setExcluindoEmpresa(true);

      await api.delete(
        `${EMPRESAS_ENDPOINT}/${id}`
      );

      if (
        String(empresaEdicaoId) === String(id)
      ) {
        setEmpresaEdicaoId("");
        setNovoNomeEmpresa("");
      }

      setEmpresaExclusaoId("");

      setMensagem(
        "Empresa excluída com sucesso."
      );

      await carregarEmpresas();
    } catch (error) {
      console.error(
        "Erro ao excluir empresa:",
        error
      );

      setErro(
        obterMensagemErro(
          error,
          "Não foi possível excluir a empresa."
        )
      );
    } finally {
      setExcluindoEmpresa(false);
    }
  }

  async function handleExcluirEmpresaSelecionada() {
    await excluirEmpresa(empresaExclusaoId);
  }

  function handleSair() {
    logoutUser();
  }

  return (
    <div className="paineladm-page">
      <header>
         <h3 className="painel">
          Painel administrativo
        </h3>

        <nav>
          <a href="/dashboard">
            Dashboard
          </a>

          <a href="/paineljogo">
            Gerenciar jogos
          </a>

          <a
            href="/gerenciar-empresas"
            className="active"
          >
            Gerenciar empresas
          </a>

          <a href="/perfil">
            Perfil
          </a>

          <a
            href="/login"
            onClick={handleSair}
          >
            Sair
          </a>
        </nav>
      </header>

      <main>
        <h1>Gerenciar empresas</h1>

        <p className="subtitulo">
          Cadastre, edite e exclua empresas do
          sistema.
        </p>

        {mensagem && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginBottom: "18px",
              padding: "10px 12px",
              border: "1px solid #67a76f",
              borderRadius: "4px",
              background: "#f1fff3",
              color: "#285c30",
            }}
          >
            {mensagem}
          </div>
        )}

        {erro && (
          <div
            role="alert"
            aria-live="assertive"
            style={{
              marginBottom: "18px",
              padding: "10px 12px",
              border: "1px solid #f05b5b",
              borderRadius: "4px",
              background: "#fff1f1",
              color: "#8c2525",
            }}
          >
            {erro}
          </div>
        )}

        <section className="card empresas">
          <div className="card-topo">
            <h2>Empresas cadastradas</h2>

            <button
              type="button"
              className="btn-roxo"
              onClick={() => {
                document
                  .getElementById(
                    "criar-empresa"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
            >
              + Cadastrar empresa
            </button>
          </div>

          <div className="tabela">
            <table>
              <thead>
                <tr>
                  <th>Nome da empresa</th>

                  <th className="col-acoes">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {carregandoEmpresas && (
                  <tr>
                    <td colSpan="2">
                      Carregando empresas...
                    </td>
                  </tr>
                )}

                {!carregandoEmpresas &&
                  empresasPaginadas.length ===
                    0 && (
                    <tr>
                      <td colSpan="2">
                        Nenhuma empresa
                        cadastrada.
                      </td>
                    </tr>
                  )}

                {!carregandoEmpresas &&
                  empresasPaginadas.map(
                    (empresa, index) => {
                      const id =
                        obterIdEmpresa(empresa);

                      const chave =
                        id ??
                        `${empresa.nome}-${index}`;

                      return (
                        <tr key={chave}>
                          <td>
                            {empresa.nome}
                          </td>

                          <td>
                            <div className="acoes">
                              <button
                                type="button"
                                className="btn-icon editar"
                                title="Editar empresa"
                                aria-label={`Editar ${empresa.nome}`}
                                disabled={!id}
                                onClick={() =>
                                  handleEditarPelaTabela(
                                    empresa
                                  )
                                }
                              >
                                <span aria-hidden="true">
                                  ✎
                                </span>
                              </button>

                              <button
                                type="button"
                                className="btn-icon excluir"
                                title="Excluir empresa"
                                aria-label={`Excluir ${empresa.nome}`}
                                disabled={
                                  excluindoEmpresa ||
                                  !id
                                }
                                onClick={() =>
                                  excluirEmpresa(id)
                                }
                              >
                                <span aria-hidden="true">
                                  ×
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
          </div>
{empresas.length > EMPRESAS_POR_PAGINA && (
  <div className="paginacao">
    <button
      type="button"
      disabled={paginaAtual === 1}
      onClick={() =>
        setPaginaAtual((pagina) =>
          Math.max(1, pagina - 1)
        )
      }
    >
      ←
    </button>

    {Array.from(
      { length: totalPaginas },
      (_, index) => index + 1
    ).map((pagina) => (
      <button
        type="button"
        key={pagina}
        className={
          paginaAtual === pagina
            ? "ativo"
            : ""
        }
        onClick={() =>
          setPaginaAtual(pagina)
        }
      >
        {pagina}
      </button>
    ))}

    <button
      type="button"
      disabled={
        paginaAtual === totalPaginas
      }
      onClick={() =>
        setPaginaAtual((pagina) =>
          Math.min(
            totalPaginas,
            pagina + 1
          )
        )
      }
    >
      →
    </button>
  </div>
)}
        </section>

        <section
          className="card"
          id="criar-empresa"
        >
          <h2 className="espaco-titulo">
            Criar nova empresa
          </h2>

          <form onSubmit={handleCriarEmpresa}>
            <label htmlFor="nomeNovaEmpresa">
              Nome da empresa
            </label>

            <input
              id="nomeNovaEmpresa"
              name="nomeNovaEmpresa"
              type="text"
              value={nomeNovaEmpresa}
              maxLength={150}
              autoComplete="organization"
              placeholder="Digite o nome da empresa"
              disabled={criandoEmpresa}
              onChange={(event) =>
                setNomeNovaEmpresa(
                  event.target.value
                )
              }
            />

            <p className="ajuda">
              Informe o nome da empresa que deseja
              criar.
            </p>

            <div className="form-acoes">
              <button
                type="submit"
                className="btn-salvar"
                disabled={criandoEmpresa}
              >
                {criandoEmpresa
                  ? "Criando..."
                  : "Criar empresa"}
              </button>
            </div>
          </form>
        </section>

        <section
          className="card"
          id="editar-empresa"
        >
          <h2 className="espaco-titulo">
            Editar empresa
          </h2>

          <form onSubmit={handleAtualizarEmpresa}>
            <label htmlFor="empresaEdicao">
              Nome da empresa
            </label>

            <select
              id="empresaEdicao"
              name="empresaEdicao"
              value={empresaEdicaoId}
              disabled={atualizandoEmpresa}
              onChange={
                handleSelecionarEmpresaEdicao
              }
            >
              <option value="">
                Selecione uma empresa
              </option>

              {empresas.map(
                (empresa, index) => {
                  const id =
                    obterIdEmpresa(empresa);

                  const chave =
                    id ??
                    `${empresa.nome}-${index}`;

                  return (
                    <option
                      key={chave}
                      value={id || ""}
                      disabled={!id}
                    >
                      {empresa.nome}
                    </option>
                  );
                }
              )}
            </select>

            <label htmlFor="novoNomeEmpresa">
              Novo nome da empresa
            </label>

            <input
              id="novoNomeEmpresa"
              name="novoNomeEmpresa"
              type="text"
              value={novoNomeEmpresa}
              maxLength={150}
              placeholder="Digite o novo nome"
              disabled={
                !empresaEdicaoId ||
                atualizandoEmpresa
              }
              onChange={(event) =>
                setNovoNomeEmpresa(
                  event.target.value
                )
              }
            />

            <div className="form-acoes">
              <button
                type="button"
                className="btn-cancelar"
                disabled={
                  atualizandoEmpresa ||
                  (!empresaEdicaoId &&
                    !novoNomeEmpresa)
                }
                onClick={handleCancelarEdicao}
              >
                Cancelar edição
              </button>

              <button
                type="submit"
                className="btn-salvar"
                disabled={
                  atualizandoEmpresa ||
                  !empresaEdicaoId
                }
              >
                {atualizandoEmpresa
                  ? "Salvando..."
                  : "Salvar alterações"}
              </button>
            </div>
          </form>
        </section>

        <section className="card">
          <h2 className="espaco-titulo">
            Excluir empresa
          </h2>

          <div className="excluir-area">
            <div>
              <label htmlFor="empresaExclusao">
                Selecione a empresa
              </label>

              <select
                id="empresaExclusao"
                name="empresaExclusao"
                value={empresaExclusaoId}
                disabled={excluindoEmpresa}
                onChange={(event) => {
                  limparAvisos();

                  setEmpresaExclusaoId(
                    event.target.value
                  );
                }}
              >
                <option value="">
                  Selecione uma empresa
                </option>

                {empresas.map(
                  (empresa, index) => {
                    const id =
                      obterIdEmpresa(empresa);

                    const chave =
                      id ??
                      `${empresa.nome}-${index}`;

                    return (
                      <option
                        key={chave}
                        value={id || ""}
                        disabled={!id}
                      >
                        {empresa.nome}
                      </option>
                    );
                  }
                )}
              </select>
            </div>

            <button
              type="button"
              className="btn-excluir-empresa"
              disabled={
                excluindoEmpresa ||
                !empresaExclusaoId
              }
              onClick={
                handleExcluirEmpresaSelecionada
              }
            >
              {excluindoEmpresa
                ? "Excluindo..."
                : "Excluir empresa"}
            </button>
          </div>
        </section>
      </main>

      <Rodape logo={logo}  />
    </div>
  );
}

export default PainelAdm;