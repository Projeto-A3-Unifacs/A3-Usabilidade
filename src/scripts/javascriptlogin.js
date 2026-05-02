// Função para validar e fornecer feedback ao usuário
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); 

  
  const loginButton = document.getElementById('login-button');
  
  
  loginButton.textContent = "Carregando...";
  loginButton.disabled = true; 

  
  setTimeout(function() {
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Verificação de e-mail e senha
    if (!email || !password) {
      showError('Por favor, preencha todos os campos corretamente.');
    } else if (!validateEmail(email)) {
      showError('Por favor, insira um e-mail válido.');
    } else {
      showSuccess('Login efetuado com sucesso!');
    }
  }, 2000); 
});


function showError(message) {
  // Exibe a mensagem de erro
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';

  
  const loginButton = document.getElementById('login-button');
  loginButton.textContent = "Login";
  loginButton.disabled = false;

 
  setTimeout(function() {
    errorMessage.style.display = 'none';
  }, 5000); 
}


function showSuccess(message) {
 
  alert(message);

  const loginButton = document.getElementById('login-button');
  loginButton.textContent = "Login";
  loginButton.disabled = false;
}

function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}