import styles from "../styles/pages/ActivateAccount.module.css";
import {useParams} from "react-router-dom";
import {server} from "../lib/config";
import useForm from "../lib/useForm";

export default function ActivateAccount(){

    const {token} = useParams(); 
    const {submitHandler} = useForm();
    
    const activateAccountHander = async ()=>{
        const success = await submitHandler("patch",`${server}/api/v1/register?uri=${token}`);
        if(success){
            window.location.replace("/login")
        }
    }

    return <div className={styles.main}>
        <div className={styles.body}>
            <h2>EasyNotes</h2>
            <p>Please press the button below in order to verify your account on EasyNotes</p>
            <button onClick={activateAccountHander}>Activate</button>
        </div>
    </div>

}