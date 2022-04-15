import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/SettingsModal.module.css";

export default function SettingsModal(props){
return <div className={styles.modal}>
    <div className={styles.body}>
        {props.children}
        <div className={styles.close} onClick={props.closeModal}>
            <FontAwesomeIcon icon={faTimes} />
        </div>
    </div>
</div>
}