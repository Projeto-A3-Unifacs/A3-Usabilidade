import { useState } from 'react';
import '../styles/stylelogin.css';
import axios from 'axios';
import logo from '../assets/logodois.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



function Login(){
    const[email,setEmail]=useState('');
    const[senha, setSenha]=useState('')
    const navigate = useNavigate();
    const [mensagemErro, setMensagemErro]
   = useState('');

     
     async function fazerLogin(event){
      
         event.preventDefault();

          try {
         const resultado= await axios.post(
            'http://localhost:3000/api/v1/auth/login',
            {email,
             senha
            }
         );

           localStorage.setItem(
         "token",
         resultado.data.token
      );
          navigate('/');
         

        }catch(erro){
          setMensagemErro(

         erro.response?.data?.message ||

         'Erro ao fazer login.'

      );
        }

}


  return(
      <div id="body-login">
    <div className="card-login">
      <div className="logo-card">
       <img src={logo}
       onClick={() => navigate('/')}
       />
      </div>
      <h3>Login</h3>
      <form onSubmit={fazerLogin} id="login-form">

        
        {
   mensagemErro && (

      <p className="erro-login">

         {mensagemErro}

      </p>

   )
}
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

 
   function voltarInicio(){

   navigate('/');

}

}

export default Login;