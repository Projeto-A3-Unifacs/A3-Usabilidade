import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Rodape from "../components/Rodape";

// Importando imagens
import logodois from "../assets/logodois.png";

// Importando CSS Modules
import styles from "../styles/stylepaineljogo.module.css";

function PainelJogo() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [usuarioLogado, setUsuarioLogado] = useState(!!token);

  const [jogos, setJogos] = useState([]);
  const [novoJogo, setNovoJogo] = useState({
    nome: "",
    preco: "",
    ano: "",
    fkCategoria: "",
    fkEmpresa: "",
    descricao: ""
  });

  const [editarJogo, setEditarJogo] = useState(null);

  // Carrega todos os jogos
  const loadJogos = async () => {
    try {
      const res = await axios.get("https://api-vendas-jogos-digitais-9fvp.onrender.com/api/jogos/");
      setJogos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadJogos();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setUsuarioLogado(false);
    navigate("/");
  }

  // Criar jogo
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://api-vendas-jogos-digitais-9fvp.onrender.com/api/jogos/", novoJogo);
      setNovoJogo({ nome: "", preco: "", ano: "", fkCategoria: "", fkEmpresa: "", descricao: "" });
      loadJogos();
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao criar jogo");
    }
  };

  // Atualizar jogo
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editarJogo) return;
    try {
      await axios.put(`https://api-vendas-jogos-digitais-9fvp.onrender.com/api/jogos/${editarJogo.id}`, editarJogo);
      setEditarJogo(null);
      loadJogos();
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao atualizar jogo");
    }
  };

  // Deletar jogo
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este jogo?")) return;
    try {
      await axios.delete(`https://api-vendas-jogos-digitais-9fvp.onrender.com/api/jogos/${id}`);
      loadJogos();
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao deletar jogo");
    }
  };

  return (
    <div>
      <header className={styles.header}>
        <img src={logodois} alt="Logo Game Nest" className={styles.logo} />
        <Navbar usuarioLogado={usuarioLogado} logout={logout} />
      </header>

      <main className={styles.container}>
        <section className={styles.adminPanel}>
          <h1>Gerenciamento de jogos</h1>
          <p>Cadastre, edite ou remova jogos disponíveis na plataforma.</p>

          {/* Jogos cadastrados */}
          <div className={styles.cardForm}>
            <h2>Jogos cadastrados</h2>
            <table className={styles.gamesTable}>
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Ano</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {jogos.map((jogo) => (
                  <tr key={jogo.id}>
                    <td>
                      <img src={jogo.img || logodois} alt={jogo.nome} className={styles.gameThumb} />
                    </td>
                    <td>{jogo.nome}</td>
                    <td>{jogo.fkCategoria}</td>
                    <td>R$ {jogo.preco}</td>
                    <td>{jogo.ano}</td>
                    <td>
                      <button className={styles.btnEdit} onClick={() => setEditarJogo(jogo)}>Editar</button>
                      <button className={styles.btnDelete} onClick={() => handleDelete(jogo.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Criar novo jogo */}
          <div className={styles.cardForm}>
            <h2>Criar novo jogo</h2>
            <form onSubmit={handleCreate}>
              <div className={styles.formRow}>
                <input type="text" placeholder="Nome do jogo" value={novoJogo.nome} onChange={(e) => setNovoJogo({...novoJogo, nome: e.target.value})} required />
                <select value={novoJogo.fkEmpresa} onChange={(e) => setNovoJogo({...novoJogo, fkEmpresa: e.target.value})} required>
                  <option value="">Vincular a empresa</option>
                </select>
                <select value={novoJogo.fkCategoria} onChange={(e) => setNovoJogo({...novoJogo, fkCategoria: e.target.value})} required>
                  <option value="">Categoria</option>
                </select>
                <input type="number" placeholder="Preço (R$)" value={novoJogo.preco} onChange={(e) => setNovoJogo({...novoJogo, preco: e.target.value})} required />
                <input type="number" placeholder="Ano lançamento" value={novoJogo.ano} onChange={(e) => setNovoJogo({...novoJogo, ano: e.target.value})} required />
              </div>
              <textarea placeholder="Descrição do jogo" value={novoJogo.descricao} onChange={(e) => setNovoJogo({...novoJogo, descricao: e.target.value})}></textarea>
              <div className={styles.formButtons}>
                <button type="reset" className={styles.formButtonsReset} onClick={() => setNovoJogo({ nome: "", preco: "", ano: "", fkCategoria: "", fkEmpresa: "", descricao: "" })}>Limpar</button>
                <button type="submit" className={styles.formButtonsSubmit}>Salvar jogo</button>
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
                  <select value={editarJogo.fkEmpresa} onChange={(e) => setEditarJogo({...editarJogo, fkEmpresa: e.target.value})} required>
                    <option value="">Vincular a empresa</option>
                  </select>
                  <select value={editarJogo.fkCategoria} onChange={(e) => setEditarJogo({...editarJogo, fkCategoria: e.target.value})} required>
                    <option value="">Categoria</option>
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

      <Rodape />
    </div>
  );
}

export default PainelJogo;