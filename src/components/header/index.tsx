import Image from "next/image";
import logo from "../../../public/images/Logo.svg";
import { ActiveLink } from "../activeLink";
import styles from "./styles.module.scss";
export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <ActiveLink legacyBehavior href="/" activeClassName={styles.active}>
          <a>
            <Image src={logo} alt="App Logo" />
          </a>
        </ActiveLink>
        <nav>
          <ActiveLink legacyBehavior href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink
            legacyBehavior
            href="/posts"
            activeClassName={styles.active}
          >
            <a>Conteúdos</a>
          </ActiveLink>
          <ActiveLink
            legacyBehavior
            href="/about"
            activeClassName={styles.active}
          >
            <a>Quem sou?</a>
          </ActiveLink>
        </nav>
        <a
          className={styles.readyButton}
          href="https://www.google.com.br/"
          type="button"
        >
          COMEÇAR
        </a>
      </div>
    </header>
  );
}
