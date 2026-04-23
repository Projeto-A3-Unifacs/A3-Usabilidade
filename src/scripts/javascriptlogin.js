// Função para validar e fornecer feedback ao usuário
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o envio do formulário para validar os campos

  // Selecionar o botão de login
  const loginButton = document.getElementById('login-button');
  
  // Alterar o texto do botão para "Carregando..." imediatamente
  loginButton.textContent = "Carregando...";
  loginButton.disabled = true; // Desabilitar o botão para evitar múltiplos cliques

  // Espera 2 segundos antes de validar os campos
  setTimeout(function() {
    // Obter valores dos campos
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
  }, 2000); // 2000ms = 2 segundos de delay
});

// Função para mostrar mensagem de erro
function showError(message) {
  // Exibe a mensagem de erro
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';

  // Restaura o texto do botão e habilita o botão novamente
  const loginButton = document.getElementById('login-button');
  loginButton.textContent = "Login";
  loginButton.disabled = false;

  // Após 5 segundos, esconder a mensagem de erro
  setTimeout(function() {
    errorMessage.style.display = 'none';
  }, 5000); // 5000ms = 5 segundos
}

// Função para mostrar mensagem de sucesso
function showSuccess(message) {
  // Exibe um alerta de sucesso
  alert(message);

  // Restaura o texto do botão e habilita o botão novamente
  const loginButton = document.getElementById('login-button');
  loginButton.textContent = "Login";
  loginButton.disabled = false;
}

// Função para validar e-mail
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}