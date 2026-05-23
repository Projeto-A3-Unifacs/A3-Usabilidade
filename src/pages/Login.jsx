import { useState } from 'react';
import '../styles/stylelogin.css';
import axios from 'axios';
import logo from '../assets/logodois.png';
import { Link } from 'react-router-dom';

function Login(){
    const[email,setEmail]=useState('');
    const[senha, setSenha]=useState('')

     
     async function fazerLogin(event){
         event.preventDefault();

          try {
         const resultado= await axios.post(
            'http://localhost:3000/api/v1/auth/login',
            {email,
             senha
            }
         );
         console.log(resultado.data)

         alert('Usuario Logado com sucesso')

        }catch(erro){
            console.log(erro)
        }

}


  return(
      <div id="body-login">
    <div className="card-login">
      <div className="logo-card">
       <img src={logo} />
      </div>
      <h3>Login</h3>
      <form onSubmit={fazerLogin} id="login-form">
     <input
        type="email"
        id="email"
        placeholder="email" 
        value={email}
        onChange={(event) =>setEmail(event.target.value) }
     />
       <input
        type= "password"
        id="password"
         placeholder="senha" 
         value={senha}
         onChange={(event) => setSenha(event.target.value)}
       />
       <button
        type="submit"
        id="login-button">
        Login
       </button>

        <div className="create-account">
          <Link to="/cadastro">
        Criar conta
     </Link>
          
        </div>
      </form>
      </div>
      </div>
  )


}

export default Login;