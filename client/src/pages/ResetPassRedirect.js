import styles from "../styles/pages/ResetPassRedirect.module.css";
import axios from "axios";
import { useEffect, useState } from "react"
import { server } from "../config";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation,faSpinner,faCheck } from "@fortawesome/free-solid-svg-icons";


export default function ResetPassRedirect(){
    const {token} = useParams();
    const [password,setPassword] = useState(null);
    const [confirmPass,setConfirmPass] = useState(null);
    const [loading,setLoading] = useState(false);
    const [success,setSuccess] = useState({status:false,msg:""});
    const [error,setError] = useState({status:false,msg:""});

    const resetUserPassHandler = (e)=>{
        e.preventDefault();
        setLoading(true);
        setError({status:false});
        axios.patch(`${server}/api/v1/user/reset-pass/${token}`,{newPassword:password,comfrimNewPass:confirmPass},{withCredentials:true})
        .then(res => {
            setLoading(false)
            setSuccess({status:true})
            window.location.replace("/login");
        })
        .catch(err => {
            setLoading(false)
            setError({status:true,msg:err.response.data.msg});
        });
    }

    return <div className={styles.main}>
    <div className={styles.body}>
        <h2>EasyNotes</h2>
        <form onSubmit={resetUserPassHandler}>
            <div className={styles.formControl}>
                <input type="password" placeholder="New password" onChange={(e)=> setPassword(e.target.value)} />
            </div>
            <div className={styles.formControl}>
                <input type="password" placeholder="Re-type password" onChange={(e)=> setConfirmPass(e.target.value)} />
            </div>
            {(error.status || success.status) && <div className={styles.msg}>
                {error.status && <><FontAwesomeIcon icon={faTriangleExclamation} /> {error.msg}</>}
                {success.status && <FontAwesomeIcon style={{color:"black"}} icon={faCheck} />}
            </div>}
            <button type="submit">{loading ? <FontAwesomeIcon className="fa-spin" icon={faSpinner} /> : "Submit"}</button>
        </form>
    </div>
</div>

}