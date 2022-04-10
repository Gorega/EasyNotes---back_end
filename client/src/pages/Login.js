import styles from "../styles/preLogin/form.module.css";
import Layout from "../components/preLogin/Layout";
import {server} from "../config";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";

export default function Login(){
    const [username,setUsername] = useState(null);
    const [email,setEmail] = useState(null);
    const [password,setPassword] = useState(null);
    const [loading,setLoading] = useState(false);
    const [success,setSuccess] = useState({msg:"",status:false});
    const [error,setError] = useState({msg:"",status:false});
    const {logginStatus,setLogginStats} = useContext(AppContext);

    const login = ()=>{
        setLoading(true)
        setError({status:false})
        axios.post(`${server}/api/v1/login`,{username,email,password},{withCredentials:true})
        .then(res => {
            setLoading(false)
            setSuccess({msg:"success",status:true});
            localStorage.setItem("user","loggedin")
            window.location.replace("/dashboard");
        })
        .catch(err => {
            console.log(err)
            setLoading(false)
            setError({msg:err.response.data.msg,status:true})
        });
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
            login={login}
            formStatus={loading}
            formResult={{status:success.status || error.status,msg:success.msg || error.msg}}>
                
            <form>
                <div className={styles.formControl}>
                    <input type="text" placeholder="Username or Email" value={email || username} onChange={(e)=>{
                        setEmail(e.target.value) || setUsername(e.target.value)
                    }} />
                </div>
                <div className={styles.formControl}>
                    <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />
                </div>
            </form>
    </Layout>
}