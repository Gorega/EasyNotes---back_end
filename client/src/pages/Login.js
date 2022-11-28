import styles from "../styles/preLogin/form.module.css";
import Layout from "../components/preLogin/Layout";
import {server} from "../lib/config";
import {useNavigate} from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import useForm from "../lib/useForm";


export default function Login(){

    const Navigate = useNavigate();
    const {loginStatus,setLoginStatus,signedUser} = useContext(AppContext);
    const [username,setUsername] = useState(null);
    const [email,setEmail] = useState(null);
    const [password,setPassword] = useState(null);
    const {error,success,loading,submitHandler} = useForm();

    const login = async ()=>{
        const success = await submitHandler("post",`${server}/api/v1/login`,{username,email,password});
        if(success){
            window.location.replace("/dashboard");
        }
    }

    useEffect(()=>{
        if(signedUser){
            window.location.replace("/dashboard");
        }else{
            setLoginStatus(false)
        }
    },[])

    if(loginStatus){
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