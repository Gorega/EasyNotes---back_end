import { useEffect,useState } from "react"
import styles from "../../styles/preLogin/Layout.module.css"
import {useLocation,Link} from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner,faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'


export default function Layout(props){

    const location = useLocation();
    const [activeFrom,setActiveForm] = useState(null);
    
    useEffect(()=>{
        if(location.pathname.includes("login")){
            setActiveForm(0)
        }else{
            setActiveForm(1)
        }
    },[location])

    return <div className={styles.layout}>
        <div className={styles.body}>
            <h2>EasyNotes</h2>
            <div className={styles.form}>
                {props.children}
            </div>
            {props.formStatus === true && <div className={styles.status}>
                <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
            </div>}
            {props.formResult.status === true && <div className={styles.msg}>
                <FontAwesomeIcon icon={faTriangleExclamation} /> {props.formResult.msg}
            </div>}
            <div className={styles.control}>
                <Link to="/login"><button className={activeFrom === 0 && styles.active} onClick={props.login}>Login</button></Link>
                <Link to="/register"><button className={activeFrom === 1 && styles.active} onClick={props.register}>Sign Up</button></Link>
            </div>
        </div>
    </div>
}