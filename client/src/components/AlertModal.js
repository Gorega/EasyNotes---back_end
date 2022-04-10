import styles from "../styles/AlertModal.module.css";

export default function AlertModal({onOk,onCancel}){
    return <div className={styles.modal}>
        <div className={styles.body}>
            <h3>Are you sure you want to delete this note?</h3>
            <div className={styles.control}>
                <button onClick={onOk}>Ok</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    </div>

}