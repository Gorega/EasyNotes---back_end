import styles from "../styles/preLogin/form.module.css";
import Layout from "../components/preLogin/Layout";
import axios from "axios";
import { server } from "../config";
import { useState } from "react";

export default function ResetPass(){
    const [email,setEmail] = useState(null);
    const [loading,setLoading] = useState(false);
    const [success,setSuccess] = useState({status:false,msg:""});
    const [error,setError] = useState({status:false,msg:""});

    const sendResetMailHandler = (e)=>{
        e.preventDefault();
        setLoading(true)
        setError({status:false})
        setSuccess({status:false});
        axios.post(`${server}/api/v1/user/email-reset-pass`,{email:email},{withCredentials:true})
        .then(res => {
            console.log(res)
            setLoading(false)
            setSuccess({status:true,msg:"a link has been sent to your email address"})
        })
        .catch(err => {
            console.log(err)
            setLoading(false);
            setError({status:true,msg:err.response.data.msg});
        });
    }
return <Layout
    formStatus={loading}
    formResult={{status:error.status,msg:success.msg || error.msg}}>

    <form onSubmit={sendResetMailHandler}>
        <p>To reset your password, enter your email below and submit. An email will be sent to you with instructions about how to complete the process.</p>
        <div className={styles.formControl}>
            <input type="email" placeholder="Email" onChange={(e)=> setEmail(e.target.value)} />
        </div>
        <div className={styles.msg}>
            {success.status && success.msg}
        </div>
        <button type="submit" className={styles.unique}>Submit</button>
    </form>
    </Layout>

}