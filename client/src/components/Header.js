import styles from "../styles/Header.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSortDown,faGear,faArrowRightFromBracket,faAngleRight, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useContext, useState,useRef } from "react";
import {AppContext} from "../AppContext";
import { server } from "../config";
import axios from "axios";

export default function Header(){
    const {user,setSearchValue,searchValue,showSearch,setShowSearch} = useContext(AppContext)
    const [showUserMenu,setShowUserMenu] = useState(false);
    const searchInputRef = useRef(null);

    const logout = ()=>{
        axios.get(`${server}/api/v1/logout`,{withCredentials:true})
        .then(res => {
            window.localStorage.clear();
            window.location.reload();
        })
        .catch(err => console.log(err));
    }

    return <div className={styles.header}>
        <div className={`${styles.search} ${showSearch && styles.active}`}>
            {showSearch ? <FontAwesomeIcon icon={faTimes} onClick={()=> {
                setShowSearch(false)
                setSearchValue("")
                searchInputRef.current.focus();
            }} /> : <FontAwesomeIcon icon={faSearch} onClick={()=> setShowSearch(true)} />}
            <input type="text" ref={searchInputRef} autoComplete="false" name="text" placeholder="Search by note content or date ..." value={searchValue} onChange={(e)=> setSearchValue(e.target.value)} />
        </div>
        <div className={`${styles.userProfile} ${showSearch && styles.hide}`} onMouseOver={()=> setShowUserMenu(true)}>
            <img src={user.image} />
            <FontAwesomeIcon icon={faSortDown} />
            <div className={`${styles.userMenu} ${showUserMenu && styles.active}`} onMouseLeave={()=> setShowUserMenu(false)}>
                <ul>
                    <li>
                        <img src={user.image} alt="" />
                        <h3>{user.username}</h3>
                        <FontAwesomeIcon icon={faGear} />
                    </li>
                    <li>
                        <div className={styles.profile}>
                        <h3>Profile</h3>
                        <p>Edit your profile</p>
                        </div>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </li>
                    <li onClick={logout}><FontAwesomeIcon icon={faArrowRightFromBracket} /> Log out</li>
                </ul>
                <div className={styles.close} onClick={()=> setShowUserMenu(false)}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
            </div>
        </div>
    </div>
}