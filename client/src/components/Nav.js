import styles from "../styles/Nav.module.css";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";

export default function Nav(){
    
    const [showColors,setShowColors] = useState(false);
    const {setNNote,showSearch} = useContext(AppContext);
    const colors = [{
        code:"#FBC770"
    },{
        code:"#F89871"
    },{
        code:"#E2EC8D"
    },{
        code:"#8AB4F8"
    },{
        code:"#B691FD"
    }]

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setShowColors(false)
        },5000)
        return()=>{
            clearTimeout(timer)
        }
    },[showColors])

return <div className={styles.nav}>
    <div className={`${styles.logo} ${showSearch && styles.hide}`}>
        EasyNotes
    </div>
    <div className={styles.create}>
        <div className={styles.plus} onClick={()=> setShowColors(true)}>+</div>
        <div className={`${styles.colors} ${showColors && styles.show}`}>
            <ul>
                {colors.map((color,index)=>{
                    const {code} = color;
                    return <li key={index} style={{backgroundColor:code}} onClick={()=>{
                        setNNote({status:true,data:{color:code}})
                    }}></li>
                })}
            </ul>
        </div>
    </div>
</div>

}