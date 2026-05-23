import { useState } from 'react';
import '../styles/style.css';
import axios from 'axios';
function Cadastro() {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [repetirSenha, setRepetirSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [contaUsuario, setContaUsuario]=useState(false);
  const [contaAdm, setContaAdm]=useState(false);
  const [termos, setTermos] = useState(false);
 const [erroSenha, setErroSenha] = useState(false);
 const [modalSucesso, setModalSucesso] = useState(false);
 

  async function cadastrar(event) {

  event.preventDefault();

  if (!termos) {

    alert('Aceite os termos');

    return;

  }

  if (senha !== repetirSenha) {

    alert('As senhas não coincidem');

    return;

  }

     const [ano, mes, dia] =
      dataNascimento.split('-');

    const dataFormatada =
      `${dia}/${mes}/${ano}`;

  try {

    const resposta = await axios.post(
      'http://localhost:3000/api/v1/auth/register',
      {
        nome,
        email,
        senha,
        dataNascimento:dataFormatada
      }
    );

    

    alert('Usuario cadastrado com sucesso!');

  } catch (erro) {

    console.log (erro.response.data.message);

   

  }

}

return (

    <div id="corpo">

      <div className="card-cadastro">

        <h4>Cadastre-se agora</h4>

        <form onSubmit={cadastrar}>

          <div className="label">
            <label>Nome Completo</label>
          </div>

          <input
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
          />

          <div className="label">
            <label>Email</label>
          </div>

          <input
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <div className="label">
            <label>Senha</label>
          </div>

          <input
            className="inputs"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
          />

          <div className="label">
            <label>Repetir Senha</label>
          </div>

          <input
            type="password"
            value={repetirSenha}
            onChange={(event) => setRepetirSenha(event.target.value)}
          />

          <div className="label">
            <label>Data de Nascimento</label>
          </div>

          <input
            type="date"
            value={dataNascimento}
            onChange={(event) => setDataNascimento(event.target.value)}
          />
  
          




          <div className="checkbox-container">

            <input
              type="checkbox"
              checked={termos}
              onChange={(event) => setTermos(event.target.checked)}
            />

            <div className="label-termos">
              <label>
                Li e concordo com os Termos de Uso e a Política de Privacidade.
              </label>
            </div>

          </div>


          <div className="button-container">

            <button
              type="button"
              className="btn-voltar"
              onClick={() => window.history.back()}
            >
              Voltar
            </button>

            <button type="submit" id="btn">
              Cadastrar
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default Cadastro;









