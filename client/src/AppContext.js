import React,{useEffect, useState} from "react";
import axios from "axios";
import {server} from "./config";

export const AppContext = React.createContext({});

const AppProvider = (props)=>{
    const [nNote,setNNote] = useState({status:false,data:{}})
    const [updateNoteStatus,setUpdateNoteStatus] = useState(false);
    const [logginStatus,setLogginStats] = useState(true);
    const [searchValue,setSearchValue] = useState("");
    const [showSearch,setShowSearch] = useState(false);
    const [user,setUser] = useState({});

    const fetchUserData = ()=>{
        axios.get(`${server}/api/v1/user`,{withCredentials:true})
        .then(res => {
            setUser({userId:res.data.userId,username:res.data.username,email:res.data.email,image:res.data.image})
        })
        .catch(err => console.log(err)); 
    }

    useEffect(()=>{
        if(localStorage.getItem("user")){
            fetchUserData();
        }

    },[])

    return <AppContext.Provider value={{
        nNote,
        setNNote,
        updateNoteStatus,setUpdateNoteStatus,
        fetchUserData,user,
        logginStatus,setLogginStats,
        searchValue,setSearchValue,
        showSearch,setShowSearch,
    }}>
        {props.children}
    </AppContext.Provider>
}

export default AppProvider;