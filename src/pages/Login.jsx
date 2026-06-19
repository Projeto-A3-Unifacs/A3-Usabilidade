import { useState } from 'react';
import '../styles/stylelogin.css';

import logo from '../assets/logodois.png';

import {
  Link,
  useNavigate
} from 'react-router-dom';

import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] =
    useState('');

  const [carregando, setCarregando] =
    useState(false);

  const navigate = useNavigate();

  async function fazerLogin(event) {
    event.preventDefault();

    setMensagemErro('');
    setCarregando(true);

    try {
      const resultado = await api.post(
        '/auth/login',
        {
          email: email.trim(),
          senha
        }
      );

      console.log(
        'Resposta da API:',
        resultado.data
      );

      const token = resultado.data?.token;

      if (
        !token ||
        typeof token !== 'string'
      ) {
        throw new Error(
          'A API não retornou um token válido.'
        );
      }

      localStorage.setItem(
        'token',
        token.trim()
      );

      navigate('/', {
        replace: true
      });
    } catch (erro) {
      console.error(
        'Erro no login:',
        erro.response?.data ||
          erro.message
      );

      localStorage.removeItem('token');

      setMensagemErro(
        erro.response?.data?.message ||
        erro.response?.data?.error ||
        erro.message ||
        'Erro ao fazer login.'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div id="body-login">
      <div className="card-login">
        <div className="logo-card">
          <img
            src={logo}
            alt="Logo"
            onClick={() =>
              navigate('/')
            }
          />
        </div>

        <h3>Login</h3>

        <form
          onSubmit={fazerLogin}
          id="login-form"
        >
          {mensagemErro && (
            <p className="erro-login">
              {mensagemErro}
            </p>
          )}

          <input
            type="email"
            id="email"
            placeholder="E-mail"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            required
          />

          <input
            type="password"
            id="password"
            placeholder="Senha"
            value={senha}
            onChange={(event) =>
              setSenha(
                event.target.value
              )
            }
            required
          />

          <button
            type="submit"
            id="login-button"
            disabled={carregando}
          >
            {carregando
              ? 'Entrando...'
              : 'Login'}
          </button>

          <div className="create-account">
            <Link to="/cadastro">
              Criar conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;