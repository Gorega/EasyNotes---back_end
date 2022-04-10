import styles from "../styles/pages/Dashboard.module.css";
import Nav from "../components/Nav";
import Header from "../components/Header";
import Main from "../components/Main";

export default function Dashboard(){
    return <div className="container">
        <div className={styles.dashboard}>
            <div className={styles.sideNav}>
                <Nav />
            </div>
            <div className={styles.body}>
                <Header />
                <Main />
            </div>
        </div>
    </div>
}