import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Rodape from "../components/Rodape";
import logodois from "../assets/games/padrao.png"
import logo from "../assets/logodois.png";
import toast from 'react-hot-toast';
import styles from "../styles/stylepaineljogo.module.css";
import {
  getToken,
  isAuthenticated
} from '../utils/auth';

function PainelJogo() {
  const navigate = useNavigate();
  
  const [usuarioLogado, setUsuarioLogado] = useState(false);

  const [jogos, setJogos] = useState([]);
  const [novoJogo, setNovoJogo] = useState({
    nome: "",
    preco: "",
    ano: "",
    fkCategoria: "",
    fkEmpresa: "",
    descricao: ""
  });
  const [categorias, setCategorias] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [editarJogo, setEditarJogo] = useState(null);


  const loadJogos = async () => {
  try {

    const autenticado = isAuthenticated();
      
                   setUsuarioLogado(autenticado);
      
                    if (!autenticado) {
                      navigate('/login');
                      }
     const token = getToken();
    const [jogosRes, categoriasRes, empresasRes] =
      await Promise.all([
        axios.get(
          "https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/jogos/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),

        axios.get(
          "https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/categorias",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),

        axios.get(
          "https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/empresas",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

    setJogos(jogosRes.data);
    setCategorias(categoriasRes.data);
    setEmpresas(empresasRes.data);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    loadJogos();
  }, []);



const categoriasMap = categorias.reduce((acc, categoria) => {
  acc[categoria.id] = categoria.nome.trim();
  return acc;
}, {});

const empresasMap = empresas.reduce((acc, empresa) => {
  acc[empresa.id] = empresa.nome.trim();
  return acc;
}, {});


  function logout() {
    localStorage.removeItem("token");
    setUsuarioLogado(false);
    navigate("/");
  }


  // Criar jogo
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      
  const token = getToken();
      await axios.post("https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/jogos/", novoJogo,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      
      setNovoJogo({ nome: "", preco: "", ano: "", fkCategoria: "", fkEmpresa: "", descricao: "" });
      loadJogos();
    } catch (err) {
      toast.error(
      err.response?.data?.error ||"Erro ao criar jogo");
    }
  };

  // Atualizar jogo
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editarJogo) return;
    try {
      
  const token = getToken();
      await axios.put(`https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/jogos/${editarJogo.id}`, editarJogo,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      setEditarJogo(null);
      loadJogos();
    } catch (err) {
      toast.error(
      err.response?.data?.error ||"Erro ao atualizar jogo");
    }
  };

  // Deletar jogo
  const handleDelete = async (id) => {
    
  const token = getToken();
    if (!window.confirm("Deseja realmente excluir este jogo?")) return;
    try {
      await axios.delete(`https://api-vendas-jogos-digitais-9fvp.onrender.com/api/v1/jogos/${id}`,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      console.log(token)
      loadJogos();
    } catch (err) {
      toast.error(
      err.response?.data?.error || "Erro ao deletar jogo"
        );
    }
  };

  return (
    <div className="body">
      <header>
         <a className={styles.painel}
         href="/"
         
         >
          Painel administrativo
        </a>

        <nav className={styles.navContainer}>
          <a href="/dashboard">
            Dashboard
          </a>

          <a href="/paineljogo">
          Gerenciar jogos
          </a>

          <a
            href="/paineladm"
            className="active"
          >
            Gerenciar empresas
          </a>

          <a href="/perfil">
            Perfil
          </a>

          <a
            href="/login"
            onClick={logout}
          >
            Sair
          </a>
        </nav>
      </header>

      <main className={styles.container}>
        <section className={styles.adminPanel}>
          <h1>Gerenciamento de jogos</h1>
          <p>Cadastre, edite ou remova jogos disponíveis na plataforma.</p>

          {/* Jogos cadastrados */}
          <div className={styles.cardForm}>
            <h2>Jogos cadastrados</h2>
            <div className={styles.tableWrapper}>
            <table className={styles.gamesTable}>
              <thead>
                <tr>
                  <th>Nome</th>
                     <th>Categoria</th>
                        <th>Empresa</th>
                        <th>Preço</th>
                       <th>Ano</th>
                       <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {jogos.map((jogo) => (
                  <tr key={jogo.id}>
  <td>{jogo.nome}</td>

  <td>
    {categoriasMap[jogo.fkCategoria] ||
      "Sem categoria"}
  </td>

  <td>
    {empresasMap[jogo.fkEmpresa] ||
      "Sem empresa"}
  </td>

  <td>R$ {jogo.preco}</td>

  <td>{jogo.ano}</td>

 <td>
  <div className={styles.acoes}>
    <button
      className={styles.btnEdit}
      onClick={() => setEditarJogo(jogo)}
    >
      Editar
    </button>

    <button
      className={styles.btnDelete}
      onClick={() => handleDelete(jogo.id)}
    >
      Excluir
    </button>
  </div>
</td>
</tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Criar novo jogo */}
          <div className={styles.cardForm}>
            <h2>Criar novo jogo</h2>
            <form onSubmit={handleCreate}>
  <div className={styles.formGrid}>
    
    <div className={styles.colunaEsquerda}>
      <label>Nome do jogo</label>
      <input
        type="text"
        placeholder="Ex.: Resident Evil 4"
        value={novoJogo.nome}
        onChange={(e) =>
          setNovoJogo({
            ...novoJogo,
            nome: e.target.value
          })
        }
        required
      />

      <label>Descrição</label>
      <textarea
        className="descricao"
        placeholder="Digite a descrição do jogo..."
        value={novoJogo.descricao}
        onChange={(e) =>
          setNovoJogo({
            ...novoJogo,
            descricao: e.target.value
          })
        }
      />
    </div>

    <div className={styles.colunaDireita}>
      <div className={styles.formRow}>
        <div>
          <label>Vincular a empresa</label>
          <select
            value={novoJogo.fkEmpresa}
            onChange={(e) =>
              setNovoJogo({
                ...novoJogo,
                fkEmpresa: e.target.value
              })
            }
            required
          >
            <option value="">
              Selecione uma empresa
            </option>

            {empresas.map((empresa) => (
              <option
                key={empresa.id}
                value={empresa.id}
              >
                {empresa.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Categoria</label>
          <select
            value={novoJogo.fkCategoria}
            onChange={(e) =>
              setNovoJogo({
                ...novoJogo,
                fkCategoria: e.target.value
              })
            }
            required
          >
            <option value="">
              Selecione uma categoria
            </option>

            {categorias.map((categoria) => (
              <option
                key={categoria.id}
                value={categoria.id}
              >
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formRow}>
        <div>
          <label>Preço (R$)</label>
          <input
            type="number"
            placeholder="Ex.: 149,90"
            value={novoJogo.preco}
            onChange={(e) =>
              setNovoJogo({
                ...novoJogo,
                preco: e.target.value
              })
            }
            required
          />
        </div>

        <div>
          <label>Ano lançamento</label>
          <input
            type="number"
            placeholder="Ex.: 2022"
            value={novoJogo.ano}
            onChange={(e) =>
              setNovoJogo({
                ...novoJogo,
                ano: e.target.value
              })
            }
            required
          />
        </div>
      </div>
    </div>

  </div>

  <div className={styles.formButtons}>
    <button
      type="reset"
      className={styles.formButtonsReset}
      onClick={() =>
        setNovoJogo({
          nome: "",
          preco: "",
          ano: "",
          fkCategoria: "",
          fkEmpresa: "",
          descricao: ""
        })
      }
    >
      Limpar
    </button>

    <button
      type="submit"
      className={styles.formButtonsSubmit}
    >
      Salvar jogo
    </button>
  </div>
</form>
          </div>

          {/* Editar jogo */}
          {editarJogo && (
            <div className={styles.cardForm}>
              <h2>Editar jogo</h2>
              <form onSubmit={handleUpdate}>
                <div className={styles.formRow}>
                  <input type="text" placeholder="Nome do jogo" value={editarJogo.nome} onChange={(e) => setEditarJogo({...editarJogo, nome: e.target.value})} required />
                 <select
  value={editarJogo.fkEmpresa}
  onChange={(e) =>
    setEditarJogo({
      ...editarJogo,
      fkEmpresa: e.target.value
    })
  }
  required
>
  <option value="">
    Vincular a empresa
  </option>

  {empresas.map((empresa) => (
    <option
      key={empresa.id}
      value={empresa.id}
    >
      {empresa.nome}
    </option>
  ))}
</select>
                  <select
  value={editarJogo.fkCategoria}
  onChange={(e) =>
    setEditarJogo({
      ...editarJogo,
      fkCategoria: e.target.value
    })
  }
  required
>
  <option value="">
    Categoria
  </option>

  {categorias.map((categoria) => (
    <option
      key={categoria.id}
      value={categoria.id}
    >
      {categoria.nome}
    </option>
  ))}
</select>
                  <input type="number" placeholder="Preço (R$)" value={editarJogo.preco} onChange={(e) => setEditarJogo({...editarJogo, preco: e.target.value})} required />
                  <input type="number" placeholder="Ano lançamento" value={editarJogo.ano} onChange={(e) => setEditarJogo({...editarJogo, ano: e.target.value})} required />
                </div>
                <textarea placeholder="Descrição do jogo" value={editarJogo.descricao} onChange={(e) => setEditarJogo({...editarJogo, descricao: e.target.value})}></textarea>
                <div className={styles.formButtons}>
                  <button type="reset" className={styles.formButtonsReset} onClick={() => setEditarJogo(null)}>Cancelar edição</button>
                  <button type="submit" className={styles.formButtonsSubmit}>Atualizar jogo</button>
                </div>
              </form>
            </div>
          )}

        </section>
      </main>

      <Rodape
      logo={logo}
      />
    </div>
  );
}

export default PainelJogo;