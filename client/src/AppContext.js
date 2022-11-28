import React,{useEffect, useState} from "react";
import axios from "axios";
import {server} from "./lib/config";
import Cookies from 'js-cookie';

export const AppContext = React.createContext({});

const AppProvider = (props)=>{

    const [user,setUser] = useState({});
    const [loginStatus,setLoginStatus] = useState(true);
    const [nNote,setNNote] = useState({status:false,data:{}})
    const [updateNoteStatus,setUpdateNoteStatus] = useState(false);
    const [searchValue,setSearchValue] = useState("");
    const [showSearch,setShowSearch] = useState(false);
    const signedUser = Cookies.get("signed");

    const fetchUserData = ()=>{
        axios.get(`${server}/api/v1/user`,{withCredentials:true})
        .then(res => {
            setUser({userId:res.data.userId,username:res.data.username,email:res.data.email,image:res.data.image})
        })
    }

    useEffect(()=>{
        if(signedUser){
            fetchUserData();
        }
    },[])

    return <AppContext.Provider value={{
        nNote,
        setNNote,
        updateNoteStatus,setUpdateNoteStatus,
        fetchUserData,user,setUser,
        loginStatus,setLoginStatus,
        searchValue,setSearchValue,
        showSearch,setShowSearch,
        signedUser
    }}>
        {props.children}
    </AppContext.Provider>
}

export default AppProvider;