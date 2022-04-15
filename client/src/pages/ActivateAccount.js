import styles from "../styles/pages/ActivateAccount.module.css";
import {useParams} from "react-router-dom";
import axios from "axios";
import {server} from "../config";

export default function ActivateAccount(){
    const {token} = useParams(); 
    const activateAccountHander = ()=>{
        axios.patch(`${server}/api/v1/user/activate-account/${token}`,{withCredentials:true})
        .then(res=> window.location.replace("/login"))
        .catch(err => console.log(err));
    }

    return <div className={styles.main}>
        <div className={styles.body}>
            <h2>EasyNotes</h2>
            <p>Please press the button below in order to verify your account on EasyNotes</p>
            <button onClick={activateAccountHander}>Activate</button>
        </div>
    </div>

}