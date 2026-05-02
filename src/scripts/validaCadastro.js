const btnCadastrar = document.getElementById('btn');

btnCadastrar.addEventListener('click', function(event) {
    event.preventDefault();

    const nome = document.querySelector('input[name="nome-completo"]').value.trim();
    const email = document.getElementById('mail').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const repetirSenha = document.getElementById('repetir').value.trim();
    const dataNascimento = document.querySelector('input[name="data_nascimento"]').value.trim();
    
    const termos = document.getElementById('termos').checked;

    if (nome === '' || email === '' || senha === '' || repetirSenha === '' || dataNascimento === '' || !termos) {
        alert("Erro: Por favor, preencha todos os campos e aceite os Termos de Uso antes de continuar.");
    } else if (senha !== repetirSenha) {
        alert("Erro: As senhas digitadas não coincidem.");
    } else {
        alert("Tudo certo! Cadastro pronto para ser enviado.");
    }
});