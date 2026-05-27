import "../styles/style.css"



function RodaPe({logo}){
    return(
         <footer className="footer">
            <div className="logo">
             <img src={logo} />
             </div>
              <p>© 2026 Arcade Corporation. Todos os direitos reservados. Todas as marcas registradas são propriedade dos seus respectivos donos no Brasil e em outros países.</p>
        
              <div className="footer-links">
                <a href="#">Termos de Uso</a>
                <a href="#">Privacidade</a>
                <a href="#">Contato</a>
              </div>
        
            </footer>
    )
}

export default RodaPe