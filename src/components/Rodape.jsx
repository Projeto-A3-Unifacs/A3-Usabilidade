import styles from "../styles/style.module.css";

function RodaPe({ logo }) {
    return (
        <footer className={styles.footer}>
            <div className={styles.logo}>
                <img src={logo} alt="Logo" />
            </div>
            <p>© 2026 Arcade Corporation. Todos os direitos reservados. Todas as marcas registradas são propriedade dos seus respectivos donos no Brasil e em outros países.</p>
    
            <div className={styles['footer-links']}>
                <a href="#">Termos de Uso</a>
                <a href="#">Privacidade</a>
                <a href="#">Contato</a>
            </div>
        </footer>
    );
}

export default RodaPe;