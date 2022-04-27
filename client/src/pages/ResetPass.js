import styles from "../styles/preLogin/form.module.css";
import Layout from "../components/preLogin/Layout";
import { server } from "../config";
import { useState } from "react";
import useForm from "../components/lib/useForm";

export default function ResetPass(){
    const {error,success,setSuccess,loading,submitHandler} = useForm();
    const [email,setEmail] = useState(null);

    const sendResetMailHandler = async (e)=>{
        e.preventDefault();
        const success = await submitHandler("post",`${server}/api/v1/user/pass-reset`,{email});
        if(success){
            setSuccess({status:true,msg:"A link has been sent to your email address"})
        }else{
            setSuccess({status:false})
        }
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