import styles from "../styles/Nav.module.css";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";

export default function Nav(){
    const [showColors,setShowColors] = useState(false);
    const {setNNote,showSearch} = useContext(AppContext);
    const colors = [{
        color:"#FBC770"
    },{
        color:"#F89871"
    },{
        color:"#E2EC8D"
    },{
        color:"#8AB4F8"
    },{
        color:"#B691FD"
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
                    return <li key={index} style={{backgroundColor:color.color}} onClick={()=>{
                        setNNote({status:true,data:{color:color.color}})
                    }}></li>
                })}
            </ul>
        </div>
    </div>
</div>

}