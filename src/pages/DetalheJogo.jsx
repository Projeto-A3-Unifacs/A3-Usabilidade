import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import axios from 'axios';

import {
  Link,
  useNavigate,
  useParams
} from 'react-router-dom';

import Navbar from '../components/Navbar';
import Rodape from '../components/Rodape';

import styles from '../styles/styledetalhe.module.css';

import logo from '../assets/logo.png';
import voltar from '../assets/voltar.png';
import jogoum from '../assets/games/jogoum.png';
import perfil from '../assets/perfil.png';
import {FaHeart, FaRegHeart } from 'react-icons/fa';
import {
  getToken,
  isAuthenticated
} from '../utils/auth';

const API_BASE_URL =
  'https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1';

const API_ORIGIN =
  'https://api-vendas-jogos-digitais-9fvp.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
  Procura o ID do usuário em diferentes
  formatos possíveis retornados pela API.
*/
function obterIdUsuarioDaAvaliacao(avaliacao) {
  return (
    avaliacao?.usuarioId ??
    avaliacao?.usuario_id ??
    avaliacao?.fkUsuario ??
    avaliacao?.fk_usuario ??
    avaliacao?.idUsuario ??
    avaliacao?.id_usuario ??
    avaliacao?.usuario?.id ??
    null
  );
}


function extrairUsuarioDaResposta(resposta) {
  const dados = resposta?.data ?? resposta;

  return (
    dados?.usuario ??
    dados?.dados?.usuario ??
    dados?.dados ??
    dados
  );
}

function extrairNomeUsuario(usuario) {
  return (
    usuario?.nome ??
    usuario?.name ??
    usuario?.nomeCompleto ??
    usuario?.nome_completo ??
    usuario?.username ??
    usuario?.apelido ??
    null
  );
}

function extrairFotoUsuario(usuario) {
  return (
    usuario?.foto ??
    usuario?.fotoPerfil ??
    usuario?.foto_perfil ??
    usuario?.imagem ??
    usuario?.avatar ??
    null
  );
}

function DetalheJogo() {
  const { id } = useParams();
  const navigate = useNavigate();

 
  const usuariosCacheRef = useRef(new Map());

  const [jogo, setJogo] = useState(null);

  const [avaliacoes, setAvaliacoes] =
    useState([]);

  const [
    minhaAvaliacao,
    setMinhaAvaliacao
  ] = useState(null);

  const [comment, setComment] =
    useState('');

  const [nota, setNota] =
    useState(0);

  const [media, setMedia] =
    useState(0);

  const [
    totalAvaliacoes,
    setTotalAvaliacoes
  ] = useState(0);

  const [
    usuarioLogado,
    setUsuarioLogado
  ] = useState(isAuthenticated());

  const [carregando, setCarregando] =
    useState(true);

  const [enviando, setEnviando] =
    useState(false);

  const [erro, setErro] =
    useState('');

  const [mensagem, setMensagem] =
    useState('');

  const [
    paginaAtual,
    setPaginaAtual
  ] = useState(1);

  const [nomeCategoria, setNomeCategoria] =
    useState('');

  const [estaNoWishlist, setEstaNoWishlist] =
    useState(false);

  const [adicionandoWishlist, setAdicionandoWishlist] =
    useState(false);

  const maxLength = 1000;
  const avaliacoesPorPagina = 5;

  const dataAtual = useMemo(() => {
    const data = new Date();

    const ano = data.getFullYear();

    const mes = String(
      data.getMonth() + 1
    ).padStart(2, '0');

    const dia = String(
      data.getDate()
    ).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }, []);

  function logout() {
    localStorage.removeItem('token');

    setUsuarioLogado(false);

    navigate('/');
  }

  const tratarErro = useCallback(
    (error) => {
      console.error(
        'Erro na página de detalhes:',
        error.response?.data ||
          error.message
      );

      const status =
        error.response?.status;

      const mensagemErro =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Erro ao realizar a operação.';

      if (
        status === 401 ||
        status === 403
      ) {
        localStorage.removeItem('token');

        setUsuarioLogado(false);

        navigate('/login', {
          replace: true
        });

        return;
      }

      if (
        error.code === 'ECONNABORTED'
      ) {
        setErro(
          'A API demorou para responder. Tente novamente.'
        );

        return;
      }

      setErro(mensagemErro);
    },
    [navigate]
  );

  
  const carregarUsuariosDasAvaliacoes =
    useCallback(async (listaAvaliacoes) => {
      if (
        !Array.isArray(listaAvaliacoes) ||
        listaAvaliacoes.length === 0
      ) {
        return [];
      }

      const idsUsuarios = [
        ...new Set(
          listaAvaliacoes
            .map(
              obterIdUsuarioDaAvaliacao
            )
            .filter(
              (usuarioId) =>
                usuarioId !== null &&
                usuarioId !== undefined
            )
            .map(String)
        )
      ];

      const idsNaoConsultados =
        idsUsuarios.filter(
          (usuarioId) =>
            !usuariosCacheRef.current.has(
              usuarioId
            )
        );

      await Promise.all(
        idsNaoConsultados.map(
          async (usuarioId) => {
            try {
              const resposta =
                await api.get(
                  `/usuarios/${encodeURIComponent(
                    usuarioId
                  )}`
                );

              const usuario =
                extrairUsuarioDaResposta(
                  resposta
                );

              const nome =
                extrairNomeUsuario(
                  usuario
                );

              const foto =
                extrairFotoUsuario(
                  usuario
                );

              usuariosCacheRef.current.set(
                usuarioId,
                {
                  id: usuarioId,
                  nome:
                    nome ||
                    `Usuário ${usuarioId}`,
                  foto: foto || null
                }
              );
            } catch (error) {
              console.error(
                `Erro ao buscar o usuário ${usuarioId}:`,
                error.response?.data ||
                  error.message
              );

             
              usuariosCacheRef.current.set(
                usuarioId,
                {
                  id: usuarioId,
                  nome:
                    `Usuário ${usuarioId}`,
                  foto: null
                }
              );
            }
          }
        )
      );

      return listaAvaliacoes.map(
        (avaliacao) => {
          const usuarioId =
            obterIdUsuarioDaAvaliacao(
              avaliacao
            );

          const usuarioEncontrado =
            usuarioId !== null &&
            usuarioId !== undefined
              ? usuariosCacheRef.current.get(
                  String(usuarioId)
                )
              : null;

          return {
            ...avaliacao,

            nomeUsuario:
              avaliacao.nomeUsuario ||
              avaliacao.nome_usuario ||
              avaliacao.usuarioNome ||
              avaliacao.usuario?.nome ||
              usuarioEncontrado?.nome ||
              (
                usuarioId
                  ? `Usuário ${usuarioId}`
                  : 'Usuário'
              ),

            fotoUsuario:
              avaliacao.fotoUsuario ||
              avaliacao.foto_usuario ||
              avaliacao.usuario?.foto ||
              usuarioEncontrado?.foto ||
              null
          };
        }
      );
    }, []);

  const carregarAvaliacoes =
    useCallback(async () => {
      if (!id) {
        return;
      }

      const [
        mediaResponse,
        minhaAvaliacaoResponse
      ] = await Promise.all([
        api.get(
          `/avaliacoes/media/${encodeURIComponent(
            id
          )}`
        ),

        api.get('/avaliacoes', {
          params: {
            jogoId: id
          }
        })
      ]);

      const resumo =
        mediaResponse.data &&
        typeof mediaResponse.data ===
          'object'
          ? mediaResponse.data
          : {};

      const listaRecebida =
        Array.isArray(
          resumo.avaliacoes
        )
          ? resumo.avaliacoes
          : [];

      
      const listaComUsuarios =
        await carregarUsuariosDasAvaliacoes(
          listaRecebida
        );

      let avaliacaoUsuario =
        minhaAvaliacaoResponse.data ||
        null;

      if (
        Array.isArray(
          avaliacaoUsuario
        )
      ) {
        avaliacaoUsuario =
          avaliacaoUsuario[0] ||
          null;
      }

      if (
        !avaliacaoUsuario ||
        typeof avaliacaoUsuario !==
          'object'
      ) {
        avaliacaoUsuario = null;
      }

      setAvaliacoes(
        listaComUsuarios
      );

      setMedia(
        Number(
          resumo.media || 0
        )
      );

      setTotalAvaliacoes(
        Number(
          resumo.totalAvaliacoes ||
            listaComUsuarios.length ||
            0
        )
      );

      setMinhaAvaliacao(
        avaliacaoUsuario
      );

      setPaginaAtual(1);

      if (avaliacaoUsuario) {
        setNota(
          Number(
            avaliacaoUsuario.nota ||
              0
          )
        );

        setComment(
          avaliacaoUsuario.comentario ||
            ''
        );
      } else {
        setNota(0);
        setComment('');
      }
    }, [
      id,
      carregarUsuariosDasAvaliacoes
    ]);

  const carregarCategoria =
    useCallback(async (fkCategoria) => {
      if (!fkCategoria) {
        setNomeCategoria(
          'Categoria não informada'
        );
        return;
      }

      try {
        const response =
          await api.get(
            `/categorias/${encodeURIComponent(
              fkCategoria
            )}`
          );

        const categoria =
          response.data;

        const nome =
          categoria?.nome ||
          categoria?.nomeCategoria ||
          categoria?.nome_categoria ||
          null;

        if (nome) {
          setNomeCategoria(nome);
        } else {
          setNomeCategoria(
            `Categoria ${fkCategoria}`
          );
        }
      } catch (error) {
        console.error(
          `Erro ao buscar a categoria ${fkCategoria}:`,
          error.response?.data ||
            error.message
        );

        setNomeCategoria(
          `Categoria ${fkCategoria}`
        );
      }
    }, []);

  const carregarStatusWishlist =
    useCallback(async () => {
      if (!id || !usuarioLogado) {
        setEstaNoWishlist(false);
        return;
      }

      try {
        const response =
          await api.get(
            '/lista-desejo/'
          );

        const listaDesejos =
          Array.isArray(
            response.data
          )
            ? response.data
            : Array.isArray(
                response.data?.dados
              )
              ? response.data.dados
              : [];

        const jogoNaLista =
          listaDesejos.some(
            (item) => {
              const jogoId =
                item?.jogoId ||
                item?.jogo_id ||
                item?.idJogo ||
                item?.id_jogo ||
                item?.jogo?.id ||
                item?.id;

              return (
                String(jogoId) ===
                String(id)
              );
            }
          );

        setEstaNoWishlist(
          jogoNaLista
        );
      } catch (error) {
        console.error(
          'Erro ao carregar lista de desejos:',
          error.response?.data ||
            error.message
        );
        setEstaNoWishlist(false);
      }
    }, [id, usuarioLogado]);

  const toggleWishlist =
    useCallback(async () => {
      if (!id || !usuarioLogado) {
        navigate('/login', {
          replace: true
        });
        return;
      }

      setAdicionandoWishlist(true);

      try {
        if (estaNoWishlist) {
          await api.delete(
            '/lista-desejo/',
            {
              data: {
                jogoId: Number(id)
              }
            }
          );
          setEstaNoWishlist(false);
        } else {
          await api.post(
            '/lista-desejo/',
            {
              jogoId: Number(id)
            }
          );
          setEstaNoWishlist(true);
        }
      } catch (error) {
        console.error(
          'Erro ao atualizar lista de desejos:',
          error.response?.data ||
            error.message
        );

        tratarErro(error);
      } finally {
        setAdicionandoWishlist(false);
      }
    }, [
      id,
      usuarioLogado,
      estaNoWishlist,
      navigate,
      tratarErro
    ]);

  const carregarPagina =
    useCallback(async () => {
      if (!id) {
        setErro(
          'ID do jogo não informado.'
        );

        setCarregando(false);

        return;
      }

      setCarregando(true);
      setErro('');

      try {
        const jogoResponse =
          await api.get(
            `/jogos/${encodeURIComponent(
              id
            )}`
          );

        if (!jogoResponse.data) {
          setJogo(null);

          setErro(
            'Jogo não encontrado.'
          );

          return;
        }

        const jogoData = jogoResponse.data;
        setJogo(jogoData);

        if (jogoData.fkCategoria) {
          await carregarCategoria(
            jogoData.fkCategoria
          );
        } else if (
          jogoData.categoria ||
          jogoData.nomeCategoria ||
          jogoData.categoriaNome ||
          jogoData.nome_categoria
        ) {
          setNomeCategoria(
            jogoData.categoria ||
            jogoData.nomeCategoria ||
            jogoData.categoriaNome ||
            jogoData.nome_categoria
          );
        }

        await Promise.all([
          carregarAvaliacoes(),
          carregarStatusWishlist()
        ]);
      } catch (error) {
        tratarErro(error);
      } finally {
        setCarregando(false);
      }
    }, [
      id,
      carregarAvaliacoes,
      carregarStatusWishlist,
      carregarCategoria,
      tratarErro
    ]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', {
        replace: true
      });

      return;
    }

    setUsuarioLogado(true);

    carregarPagina();
  }, [
    carregarPagina,
    navigate
  ]);

  function clearForm() {
    setComment('');
    setNota(0);
    setErro('');
    setMensagem('');
  }

  async function enviarAvaliacao() {
    setErro('');
    setMensagem('');

    if (
      nota < 1 ||
      nota > 5
    ) {
      setErro(
        'Selecione uma nota entre 1 e 5 estrelas.'
      );

      return;
    }

    if (!id) {
      setErro(
        'ID do jogo não encontrado.'
      );

      return;
    }

    setEnviando(true);

    const dadosAvaliacao = {
      jogoId: Number(id),
      nota: Number(nota),
      comentario: comment.trim()
    };

    try {
      let response;

      if (minhaAvaliacao) {
        response = await api.put(
          '/avaliacoes',
          dadosAvaliacao
        );
      } else {
        response = await api.post(
          '/avaliacoes',
          dadosAvaliacao
        );
      }

      setMensagem(
        response.data?.message ||
          (
            minhaAvaliacao
              ? 'Avaliação atualizada com sucesso!'
              : 'Avaliação criada com sucesso!'
          )
      );

      await carregarAvaliacoes();
    } catch (error) {
      tratarErro(error);
    } finally {
      setEnviando(false);
    }
  }

  const distribuicaoAvaliacoes =
    useMemo(() => {
      const quantidades = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      };

      avaliacoes.forEach(
        (avaliacao) => {
          const valorNota = Number(
            avaliacao.nota
          );

          if (
            valorNota >= 1 &&
            valorNota <= 5
          ) {
            quantidades[
              valorNota
            ] += 1;
          }
        }
      );

      return [5, 4, 3, 2, 1].map(
        (valorNota) => {
          const quantidade =
            quantidades[
              valorNota
            ];

          const percentual =
            totalAvaliacoes > 0
              ? Math.round(
                  (
                    quantidade /
                    totalAvaliacoes
                  ) * 100
                )
              : 0;

          return {
            nota: valorNota,
            quantidade,
            percentual
          };
        }
      );
    }, [
      avaliacoes,
      totalAvaliacoes
    ]);

  const totalPaginas =
    Math.max(
      1,
      Math.ceil(
        avaliacoes.length /
          avaliacoesPorPagina
      )
    );

  const indiceInicial =
    (paginaAtual - 1) *
    avaliacoesPorPagina;

  const avaliacoesPaginadas =
    avaliacoes.slice(
      indiceInicial,
      indiceInicial +
        avaliacoesPorPagina
    );

  function mudarPagina(pagina) {
    if (
      pagina >= 1 &&
      pagina <= totalPaginas
    ) {
      setPaginaAtual(pagina);
    }
  }

  function renderizarEstrelas(
    valor
  ) {
    const quantidade = Math.max(
      0,
      Math.min(
        5,
        Math.round(
          Number(valor) || 0
        )
      )
    );

    return (
      '★'.repeat(quantidade) +
      '☆'.repeat(
        5 - quantidade
      )
    );
  }

  function obterNomeUsuario(
    avaliacao
  ) {
    const usuarioId =
      obterIdUsuarioDaAvaliacao(
        avaliacao
      );

    return (
      avaliacao.nomeUsuario ||
      avaliacao.nome_usuario ||
      avaliacao.usuarioNome ||
      avaliacao.usuario?.nome ||
      (
        usuarioId
          ? `Usuário ${usuarioId}`
          : 'Usuário'
      )
    );
  }

  function formatarData(
    avaliacao
  ) {
    const valorData =
      avaliacao.dataAvaliacao ||
      avaliacao.data_avaliacao ||
      avaliacao.dataCriacao ||
      avaliacao.data_criacao ||
      avaliacao.createdAt ||
      avaliacao.created_at ||
      avaliacao.data;

    if (!valorData) {
      return 'Data não informada';
    }

    const valorNormalizado =
      typeof valorData === 'string'
        ? valorData.replace(
            ' ',
            'T'
          )
        : valorData;

    const data = new Date(
      valorNormalizado
    );

    if (
      Number.isNaN(
        data.getTime()
      )
    ) {
      return String(valorData);
    }

    return data.toLocaleString(
      'pt-BR'
    );
  }

  function obterCategoria() {
    if (nomeCategoria) {
      return nomeCategoria;
    }

    if (
      typeof jogo?.categoria ===
      'string'
    ) {
      return jogo.categoria;
    }

    return (
      jogo?.nomeCategoria ||
      jogo?.categoriaNome ||
      jogo?.nome_categoria ||
      jogo?.categoria?.nome ||
      'Categoria não informada'
    );
  }

  function obterImagemJogo() {
    const imagem =
      jogo?.imagem ||
      jogo?.imagemUrl ||
      jogo?.imagem_url ||
      jogo?.capa ||
      jogo?.urlImagem;

    if (!imagem) {
      return jogoum;
    }

    if (
      imagem.startsWith(
        'http://'
      ) ||
      imagem.startsWith(
        'https://'
      ) ||
      imagem.startsWith(
        'data:'
      )
    ) {
      return imagem;
    }

    return `${API_ORIGIN}${
      imagem.startsWith('/')
        ? imagem
        : `/${imagem}`
    }`;
  }

  function obterFotoDaAvaliacao(
    avaliacao
  ) {
    const foto =
      avaliacao.fotoUsuario ||
      avaliacao.foto_usuario ||
      avaliacao.usuario?.foto;

    if (!foto) {
      return perfil;
    }

    if (
      foto.startsWith('http://') ||
      foto.startsWith('https://') ||
      foto.startsWith('data:')
    ) {
      return foto;
    }

    return `${API_ORIGIN}${
      foto.startsWith('/')
        ? foto
        : `/${foto}`
    }`;
  }

  if (carregando) {
    return (
      <div className="jogo-detalhe">
        <header
          className={styles.header}
        >
          <img
            src={logo}
            alt="Logo Game Nest"
            className={styles.logo}
          />

          <Navbar
            usuarioLogado={
              usuarioLogado
            }
            logout={logout}
          />
        </header>

        <main
          className={
            styles.container
          }
        >
          <p>
            Carregando informações do jogo...
          </p>
        </main>

        <Rodape logo={logo} />
      </div>
    );
  }

  if (!jogo) {
    return (
      <div>
        <header
          className={styles.header}
        >
          <img
            src={logo}
            alt="Logo Game Nest"
            className={styles.logo}
          />

          <Navbar
            usuarioLogado={
              usuarioLogado
            }
            logout={logout}
          />
        </header>

        <main
          className={
            styles.container
          }
        >
          <p
            className={
              styles.errorMessage
            }
          >
            {erro ||
              'Jogo não encontrado.'}
          </p>

          <button
            type="button"
            className={
              styles.btnSubmit
            }
            onClick={() =>
              navigate(
                '/meusjogos'
              )
            }
          >
            Voltar
          </button>
        </main>

        <Rodape logo={logo} />
      </div>
    );
  }

  return (
    <div>
      <header
        className={styles.header}
      >
        <img
          src={logo}
          alt="Logo Game Nest"
          className={styles.logo}
        />

        <Navbar
          usuarioLogado={
            usuarioLogado
          }
          logout={logout}
        />
      </header>

      <main
        className={
          styles.container
        }
      >
        <section
          className={
            styles.gameDetail
          }
        >
          <Link
            to="/meusjogos"
            className={
              styles.backLink
            }
          >
            <img
              src={voltar}
              alt=""
            />

            Voltar para os jogos
          </Link>

          <div
            className={
              styles.gameTop
            }
          >
            <img
              src={obterImagemJogo()}
              alt={jogo.nome}
              className={
                styles.gameImg
              }
              onError={(event) => {
                event.currentTarget.src =
                  jogoum;
              }}
            />

            <div
              className={
                styles.gameInfo
              }
            >
              <h1>
                {jogo.nome}
              </h1>

              <p
                className={
                  styles.genre
                }
              >
                {obterCategoria()}
              </p>

              <p
                className={
                  styles.description
                }
              >
                {jogo.descricao ||
                  'Descrição não informada para este jogo.'}
              </p>

              {jogo.ano && (
                <p
                  className={
                    styles.exploration
                  }
                >
                  Ano de lançamento:{' '}
                  {jogo.ano}
                </p>
              )}

              {jogo.preco !==
                undefined &&
                jogo.preco !==
                  null && (
                  <p
                    className={
                      styles.exploration
                    }
                  >
                    Preço:{' '}
                    {Number(
                      jogo.preco
                    ).toLocaleString(
                      'pt-BR',
                      {
                        style:
                          'currency',
                        currency:
                          'BRL'
                      }
                    )}
                  </p>
                )}

              <button
                type="button"
                className={
                  styles.wishlistBtn
                }
                onClick={toggleWishlist}
                disabled={adicionandoWishlist}
                title={
                  estaNoWishlist
                    ? 'Remover da lista de desejos'
                    : 'Adicionar à lista de desejos'
                }
              >
                {estaNoWishlist ? (
                  <FaHeart />
                ) : (
                  <FaRegHeart />
                )}
                <span>
                  {
                    estaNoWishlist
                      ? 'Remover da lista'
                      : 'Adicionar à lista'
                  }
                </span>
              </button>
            </div>
          </div>

          <div
            className={
              styles.reviewsSection
            }
          >
            <div
              className={
                styles.submitReview
              }
            >
              <h2>
                {minhaAvaliacao
                  ? 'Editar avaliação'
                  : 'Avaliar o jogo'}
              </h2>

              <p>
                Compartilhe sua experiência
                com outros jogadores.
              </p>

              <label>
                Sua avaliação
              </label>

              <div
                className={
                  styles.ratingInput
                }
              >
                <div
                  className={
                    styles.ratingStars
                  }
                >
                  {[1, 2, 3, 4, 5].map(
                    (estrela) => (
                      <button
                        key={estrela}
                        type="button"
                        className={`${
                          styles.starButton
                        } ${
                          estrela <= nota
                            ? styles.starSelected
                            : ''
                        }`}
                        onClick={() =>
                          setNota(
                            estrela
                          )
                        }
                        aria-label={`${estrela} ${
                          estrela === 1
                            ? 'estrela'
                            : 'estrelas'
                        }`}
                        aria-pressed={
                          estrela <= nota
                        }
                      >
                        ★
                      </button>
                    )
                  )}
                </div>

                <span
                  className={
                    styles.ratingText
                  }
                >
                  {nota > 0
                    ? `${nota} de 5`
                    : 'Selecione a nota'}
                </span>
              </div>

              <div
                className={
                  styles.commentWrapper
                }
              >
                <textarea
                  className={
                    styles.textarea
                  }
                  value={comment}
                  onChange={(
                    event
                  ) =>
                    setComment(
                      event.target
                        .value
                    )
                  }
                  placeholder="Comentário"
                  maxLength={
                    maxLength
                  }
                />

                <span
                  className={
                    styles.charCount
                  }
                >
                  {comment.length}/
                  {maxLength}
                </span>
              </div>

              <p
                className={
                  styles.guidelines
                }
              >
                Seja respeitoso e siga
                nossas diretrizes da
                comunidade.
              </p>

              {erro && (
                <p
                  className={
                    styles.errorMessage
                  }
                >
                  {erro}
                </p>
              )}

              {mensagem && (
                <p
                  className={
                    styles.successMessage
                  }
                >
                  {mensagem}
                </p>
              )}

              <div
                className={
                  styles.centeredSection
                }
              >
                <label>
                  Data da avaliação
                </label>

                <input
                  type="date"
                  value={dataAtual}
                  className={
                    styles.reviewDate
                  }
                  readOnly
                />

                <div
                  className={
                    styles.buttons
                  }
                >
                  <button
                    type="button"
                    className={
                      styles.btnClear
                    }
                    onClick={
                      clearForm
                    }
                    disabled={
                      enviando
                    }
                  >
                    Limpar
                  </button>

                  <button
                    type="button"
                    className={
                      styles.btnSubmit
                    }
                    onClick={
                      enviarAvaliacao
                    }
                    disabled={
                      enviando
                    }
                  >
                    {enviando
                      ? 'Salvando...'
                      : minhaAvaliacao
                        ? 'Atualizar'
                        : 'Avaliar'}
                  </button>
                </div>
              </div>
            </div>

            <div
              className={
                styles.summaryReview
              }
            >
              <h2>
                Resumo das avaliações
              </h2>

              <div
                className={
                  styles.reviewSummaryGrid
                }
              >
                <div
                  className={
                    styles.avgSection
                  }
                >
                  <p
                    className={
                      styles.average
                    }
                  >
                    {media.toLocaleString(
                      'pt-BR',
                      {
                        minimumFractionDigits:
                          1,
                        maximumFractionDigits:
                          2
                      }
                    )}
                  </p>

                  <div
                    className={
                      styles.starsSummary
                    }
                  >
                    {renderizarEstrelas(
                      media
                    )}
                  </div>

                  <p
                    className={
                      styles.label
                    }
                  >
                    média das avaliações
                  </p>
                </div>

                <div
                  className={
                    styles.verticalSeparator
                  }
                />

                <div
                  className={
                    styles.totalSection
                  }
                >
                  <p
                    className={
                      styles.total
                    }
                  >
                    {totalAvaliacoes}
                  </p>

                  <p
                    className={
                      styles.label
                    }
                  >
                    Total de avaliações
                  </p>
                </div>
              </div>

              <div
                className={
                  styles.ratingBar
                }
              >
                {distribuicaoAvaliacoes.map(
                  (item) => (
                    <div
                      className={
                        styles.ratingLine
                      }
                      key={
                        item.nota
                      }
                    >
                      <span
                        className={
                          styles.labelLeft
                        }
                      >
                        {item.nota}{' '}
                        {item.nota ===
                        1
                          ? 'estrela'
                          : 'estrelas'}
                      </span>

                      <div
                        className={
                          styles.bar
                        }
                      >
                        <div
                          className={
                            styles.fill
                          }
                          style={{
                            width: `${item.percentual}%`
                          }}
                        />
                      </div>

                      <span
                        className={
                          styles.labelRight
                        }
                      >
                        {
                          item.quantidade
                        }{' '}
                        (
                        {
                          item.percentual
                        }
                        %)
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div
            className={
              styles.gameReviews
            }
          >
            <h2>
              Avaliações do jogo
            </h2>

            {avaliacoesPaginadas.length ===
            0 ? (
              <p>
                Este jogo ainda não possui
                avaliações.
              </p>
            ) : (
              avaliacoesPaginadas.map(
                (
                  avaliacao,
                  index
                ) => (
                  <div
                    className={
                      styles.review
                    }
                    key={
                      avaliacao.id ||
                      `${
                        obterIdUsuarioDaAvaliacao(
                          avaliacao
                        ) ||
                        'avaliacao'
                      }-${index}`
                    }
                  >
                    <img
                      src={obterFotoDaAvaliacao(
                        avaliacao
                      )}
                      alt={obterNomeUsuario(
                        avaliacao
                      )}
                      onError={(
                        event
                      ) => {
                        event.currentTarget.src =
                          perfil;
                      }}
                    />

                    <div
                      className={
                        styles.reviewInfo
                      }
                    >
                      <h3>
                        {obterNomeUsuario(
                          avaliacao
                        )}
                      </h3>

                      <div
                        className={
                          styles.stars
                        }
                      >
                        {renderizarEstrelas(
                          avaliacao.nota
                        )}
                      </div>

                      <p>
                        {avaliacao.comentario ||
                          'O usuário não deixou comentário.'}
                      </p>
                    </div>

                    <div
                      className={
                        styles.reviewMeta
                      }
                    >
                      <span
                        className={
                          styles.reviewDatec
                        }
                      >
                        {formatarData(
                          avaliacao
                        )}
                      </span>

                      <span
                        className={
                          styles.reviewMenu
                        }
                      >
                        ⋮
                      </span>
                    </div>
                  </div>
                )
              )
            )}
          </div>

          {totalPaginas > 1 && (
            <div
              className={
                styles.pagination
              }
            >
              <button
                type="button"
                className={
                  styles.pageBtn
                }
                onClick={() =>
                  mudarPagina(
                    paginaAtual - 1
                  )
                }
                disabled={
                  paginaAtual === 1
                }
              >
                &lt;
              </button>

              {Array.from(
                {
                  length:
                    totalPaginas
                },
                (_, index) =>
                  index + 1
              ).map((pagina) => (
                <button
                  type="button"
                  key={pagina}
                  className={`${
                    styles.pageBtn
                  } ${
                    paginaAtual ===
                    pagina
                      ? styles.active
                      : ''
                  }`}
                  onClick={() =>
                    mudarPagina(
                      pagina
                    )
                  }
                >
                  {pagina}
                </button>
              ))}

              <button
                type="button"
                className={
                  styles.pageBtn
                }
                onClick={() =>
                  mudarPagina(
                    paginaAtual + 1
                  )
                }
                disabled={
                  paginaAtual ===
                  totalPaginas
                }
              >
                &gt;
              </button>
            </div>
          )}
        </section>
      </main>

      <Rodape logo={logo} />
    </div>
  );
}

export default DetalheJogo;