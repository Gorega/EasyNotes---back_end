import axios from "axios";
import { useState } from "react";

export default function useForm(){
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState({status:false,msg:""});
    const [success,setSuccess] = useState({status:false,msg:""});

    const submitHandler = (method,url,params)=>{
        setLoading(true)
        setError({status:false})
        setSuccess({status:false})
        return axios[method](url,params,{withCredentials:true})
        .then(res => {
            setLoading(false)
            setSuccess({status:true,msg:""});
            return true;
        })
        .catch(err => {
            setLoading(false)
            setError({status:true,msg:err.response.data.msg})
            return false;
        });
    }
    
    return {loading,setLoading,error,setError,success,setSuccess,submitHandler}
}