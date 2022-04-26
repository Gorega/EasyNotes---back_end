import styles from "../styles/preLogin/form.module.css";
import Layout from "../components/preLogin/Layout";
import {server} from "../config";
import { useState,useEffect, useContext } from "react";
import {AppContext} from "../AppContext";
import useForm from "../components/lib/useForm";

export default function Register(){
    const {error,success,setSuccess,loading,submitHandler} = useForm();
    const [username,setUsername] = useState(null);
    const [password,setPassword] = useState(null);
    const [email,setEmail] = useState(null);
    const [confirmPass,setConfirmPass] = useState(null);
    const {logginStatus,setLogginStats} = useContext(AppContext);

    const register = async ()=>{
        const success = await submitHandler("post",`${server}/api/v1/register`,{username,password,email,confirmPass});
        if(success){
            setSuccess({status:true,msg:"Email has been sent to your email address, please verify your account"})
        }else{
            setSuccess({status:false})
        }
    }
    
    useEffect(()=>{
        if(localStorage.getItem("user")){
            window.location.replace("/dashboard");
        }else{
            setLogginStats(false)
        }
    },[])

    if(logginStatus){
        return "loading..."
    }

    return <Layout 
            register={register}
            formStatus={loading}
            formResult={{status:error.status,msg:success.msg || error.msg}}>

            <form onSubmit={register}>
                <div className={styles.formControl}>
                    <input type="text" placeholder="username" value={username} onChange={(e)=> setUsername(e.target.value)} required />
                </div>
                <div className={styles.formControl}>
                    <input type="text" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} required />
                </div>
                <div className={styles.formControl}>
                    <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
                </div>
                <div className={styles.formControl}>
                    <input type="password" placeholder="Re-type password" value={confirmPass} onChange={(e)=> setConfirmPass(e.target.value)} required />
                </div>
                {success.status && <div className={styles.msg}>
                    {success.status && success.msg}
                </div>}
            </form>
    </Layout>
}