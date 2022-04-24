import { useState } from "react";

export default function useForm(){
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState({status:false,msg:""});
    const [success,setSuccess] = useState({status:false,msg:""});

    const submitHandler = (method,apiUrl,transformData,form,successMsg)=>{
        setLoading(true)
        setError({status:false})
        setSuccess({status:false})
        method(apiUrl,transformData && transformData,{withCredentials:true})
        .then(res => {
            setLoading(false)
            setSuccess({status:true,msg:successMsg});
            switch(form){
                case "setStorage":
                    // localStorage.setItem("user","loggedin")
                    window.location.replace("/dashboard");
                break;
                case "redirectToLogin":
                    window.location.replace("/login");
                break;
                case "reload":
                    window.location.reload();
                break;
                default:
                    return;
            }
        })
        .catch(err => {
            setLoading(false)
            setError({status:true,msg:err.response.data.msg})
        });
    }
    
    return {loading,setLoading,error,setError,success,submitHandler}
}