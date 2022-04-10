import styles from "../styles/preLogin/form.module.css";
import Layout from "../components/preLogin/Layout";
import {server} from "../config";
import axios from "axios";
import { useState,useEffect, useContext } from "react";
import {AppContext} from "../AppContext";
import {useNavigate} from "react-router-dom";

export default function Register(){
    const [username,setUsername] = useState(null);
    const [password,setPassword] = useState(null);
    const [email,setEmail] = useState(null);
    const [confirmPass,setConfirmPass] = useState(null);
    const [loading,setLoading] = useState(false);
    const [success,setSuccess] = useState({msg:"",status:false});
    const [error,setError] = useState({msg:"",status:false});
    const Navigate = useNavigate();
    const {logginStatus,setLogginStats} = useContext(AppContext);

    const register = ()=>{
        setLoading(true)
        setError({status:false})
        axios.post(`${server}/api/v1/register`,{username,password,email,confirmPass},{withCredentials:true})
        .then(res => {
            console.log(res)
            setLoading(false)
            setSuccess({status:true,msg:"success"})
            Navigate("/login")
        })
        .catch(err => {
            console.log(err)
            setLoading(false)
            setError({status:true,msg:err.response.data.msg})
        })
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
            formResult={{status:success.status || error.status,msg:success.msg || error.msg}}>

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
                    <input type="password" placeholder="Verify Password" value={confirmPass} onChange={(e)=> setConfirmPass(e.target.value)} required />
                </div>
            </form>
    </Layout>
}