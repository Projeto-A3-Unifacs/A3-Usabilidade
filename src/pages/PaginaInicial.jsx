import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logodois.png';
import '../styles/style.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import GameSection from '../components/GameSection';
import GameCard from '../components/GameCard';
import Rodape from '../components/Rodape';
import Navbar from '../components/Navbar';
import funil from '../assets/funil.png';
import a from '../assets/games/a.png';
import b from '../assets/games/b.png';
import c from '../assets/games/c.png';
import d from '../assets/games/d.png';
import e from '../assets/games/e.png';
import f from '../assets/games/f.png';
import h from '../assets/games/h.png';
import i from '../assets/games/i.png';
import j from '../assets/games/j.png';
import k from '../assets/games/k.png';
import l from '../assets/games/l.png';
import m from '../assets/games/m.png';  
import n from '../assets/games/n.png';
import logoBusca from '../assets/lupa.png';
import { FaSearch } from "react-icons/fa";
import estrela from '../assets/estrela.png';
import fogete from '../assets/foguete.png';
import incendio from '../assets/incendio.png';
import promo from '../assets/promo.png';
import {
  getToken,
  isAuthenticated
} from '../utils/auth';

import semImagem from '../assets/games/padrao.png';






function PaginaInicial() {

    const imagens = [a, b, c, d, e, f, h, i, j, k, l, m, n];

    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('token');
        setUsuarioLogado(false);
        navigate('/');
    }

    const [jogos, setJogos] = useState([]);
    const [usuarioLogado, setUsuarioLogado] = useState(false);
    const [busca, setBusca] = useState('');
    
    const [mostrarFiltro, setMostrarFiltro] = useState(false);
    const [ordenacao, setOrdenacao] = useState('Mais populares');
    const [categorias, setCategorias] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);





    async function carregarJogos() {
        try {
            const resposta = await axios.get("https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/public/jogos");
            
            if (resposta.data && Array.isArray(resposta.data)) {
                const jogosComImagem = resposta.data.map((jogo, index) => {
                    return {
                        ...jogo,
                        imagem: imagens[index] || semImagem
                    }
                });
                setJogos(jogosComImagem);
            } else {
                setJogos([]);
            }
        } catch (erro) {
            console.log(erro);
            setJogos([]);
        }
    }

    function alternarGenero(nomeCategoria) {
        if (categoriaSelecionada === nomeCategoria) {
            setCategoriaSelecionada(null);
        } else {
            setCategoriaSelecionada(nomeCategoria);
        }
    }

    function limparFiltros() {
        setCategoriaSelecionada(null);
        setBusca('');
        setOrdenacao('Mais populares');
    }

    useEffect(() => {
            const autenticado = isAuthenticated();

             setUsuarioLogado(autenticado);

              if (!autenticado) {
                navigate('/login');
                }
        async function carregarDadosIniciais() {
            try {
                const tokenAtual = getToken();
                const config = tokenAtual ? { headers: { Authorization: `Bearer ${tokenAtual}` } } : {};
                
                const respostaCategorias = await axios.get("https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/categorias", config);
                setCategorias(respostaCategorias.data || []);
            } catch (erro) {
                console.log(erro);
            }
            
            carregarJogos();
        }

        carregarDadosIniciais();
    }, []);

    let jogosParaExibir = [...jogos];

    if (busca.trim() !== '') {
        jogosParaExibir = jogosParaExibir.filter((jogo) => 
            jogo.nome.toLowerCase().includes(busca.toLowerCase())
        );
    }

    if (categoriaSelecionada !== null) {
        jogosParaExibir = jogosParaExibir.filter((jogo) => {
            if (jogo.categoria) {
                return jogo.categoria.trim() === categoriaSelecionada.trim();
            }
            return false;
        });
    }

    if (ordenacao === 'Menor preço') {
        jogosParaExibir.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
    } else if (ordenacao === 'Maior preço') {
        jogosParaExibir.sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));
    }

    const isFiltrando = busca.trim() !== '' || categoriaSelecionada !== null || ordenacao !== 'Mais populares';

    const destaques = jogos.slice(0, 10);
    const lancamentos = jogos.slice(5, 15);
    const promocoes = jogos.filter(jogo => jogo.preco < 40).slice(0, 10);
    const maisVendidos = jogos.slice(10, 20);

    return (
        <div className="inicial">
            <div className="topo">
                <div className="busca-wrapper">
                    <div className="busca-container">
                        <input
                            className="busca"
                            placeholder="Buscar"
                            type="text"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            onClick={() => setMostrarFiltro(!mostrarFiltro)}
                        />
                        <img
                            src={logoBusca}
                            className="icone-busca"
                            alt="Buscar"
                        />
                    </div>
                </div>

                <Navbar
                    usuarioLogado={usuarioLogado}
                    logout={logout}
                />
            </div>

            <div className="conteudo">
                {isFiltrando || mostrarFiltro ? (
                    <div className="layout-busca">
                        {mostrarFiltro && (
                            <div className="filtro-sidebar">
                                <div className="filtro-header">
                                    <img src={funil} alt="Filtro" className="icone-filtro-header" />
                                    <span>Filtros</span>
                                </div>
                                <div className="filtro-ordenacao">
                                    <label>Ordenar por:</label>
                                    <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
                                        <option value="Mais populares">Mais populares</option>
                                        <option value="Menor preço">Menor preço</option>
                                        <option value="Maior preço">Maior preço</option>
                                    </select>
                                </div>
                                <div className="filtro-generos">
                                    <label>Gêneros</label>
                                    {categorias.map(cat => (
                                        <div className="checkbox-item" key={cat.id}>
                                            <input
                                                type="checkbox"
                                                id={`cat-${cat.id}`}
                                                checked={categoriaSelecionada === cat.nome}
                                                onChange={() => alternarGenero(cat.nome)}
                                            />
                                            <label htmlFor={`cat-${cat.id}`}>{cat.nome}</label>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-limpar" onClick={limparFiltros}>
                                    🗑️ Limpar filtros
                                </button>
                            </div>
                        )}
                        <div className="resultado-busca">
                            <h2>Resultados da busca</h2>
                            <div className="games-row">
                                {jogosParaExibir.length > 0 ? (
                                    jogosParaExibir.map((jogo) => (
                                        <GameCard
                                            key={jogo.id}
                                            jogo={jogo}
                                        />
                                    ))
                                ) : (
                                    <p>Nenhum jogo encontrado para esta categoria ou busca.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <GameSection
                            titulo="Destaques"
                            icone={estrela}
                            jogos={destaques}
                        />
                        
                        <GameSection
                            titulo="Lançamentos"
                            icone={fogete}
                            jogos={lancamentos}
                        />

                        <GameSection
                            titulo="Promoções"
                            icone={promo}
                            jogos={promocoes}
                        />

                        <GameSection
                            titulo="Mais vendidos"
                            icone={incendio}
                            jogos={maisVendidos}
                        />
                    </>
                )}
            </div>

            <Rodape
                logo={logo}
            />
        </div>
    )
}

export default PaginaInicial