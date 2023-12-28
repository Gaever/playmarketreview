import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <p>SaharaSell</p>
      <p>
        <a href="mailto:mail@saharasell.app">mail@saharasell.app</a>
      </p>
      <p>Please white an email if you wish to delete your account.</p>
    </main>
  );
}
