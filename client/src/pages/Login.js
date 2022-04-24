import styles from "../styles/preLogin/form.module.css";
import Layout from "../components/preLogin/Layout";
import {server} from "../config";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import useForm from "../components/lib/useForm";


export default function Login(){
    const {error,success,loading,submitHandler} = useForm();
    const [username,setUsername] = useState(null);
    const [email,setEmail] = useState(null);
    const [password,setPassword] = useState(null);
    const {logginStatus,setLogginStats,signedUser} = useContext(AppContext);
    const Navigate = useNavigate();

    const login = ()=>{
            return submitHandler(axios.post,
            `${server}/api/v1/login`,
            {username,email,password},
            "setStorage" )
    }

    useEffect(()=>{
        if(signedUser){
            window.location.replace("/dashboard");
        }else{
            setLogginStats(false)
        }
    },[])

    if(logginStatus){
        return "loading..."
    }

    return <Layout
            login={login}
            formStatus={loading}
            formResult={{status:error.status,msg:success.msg || error.msg}}>
                
            <form>
                <div className={styles.formControl}>
                    <input type="text" placeholder="Username or Email" value={email || username} onChange={(e)=>{
                        setEmail(e.target.value) || setUsername(e.target.value)
                    }} />
                </div>
                <div className={styles.formControl}>
                    <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />
                </div>
                <span className={styles.hint} onClick={()=> Navigate("/reset-pass")}>Forget password?</span>
            </form>
        </Layout>
}