import styles from "../styles/pages/Settings.module.css";
import Header from "../components/Header";
import SettingsModal from "../components/SettingsModal";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import axios from "axios";
import { server } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation,faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Settings(){
    const {user} = useContext(AppContext);
    const [passowrdModal,setPasswordModal] = useState(false);
    const [emailModal,setEmailModal] = useState(false);
    const [currentPass,setCurrentPass] = useState(null);
    const [newPass,setNewPass] = useState(null);
    const [confirmNewPass,setConfirmNewPass] = useState(null);
    const [newEmail,setNewEmail] = useState(null);
    const [newUsername,setNewUsername] = useState(null);
    const [verificationCode,setVerificationCode] = useState(null);
    const [sendEmail,setSendEmail] = useState(false);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState({status:false,msg:""});

    const pathUsername = (e)=>{
        e.preventDefault();
        setLoading(true)
        setError({status:false})
        axios.patch(`${server}/api/v1/user/username-reset`,{newUsername:newUsername ? newUsername : user.username},{withCredentials:true})
        .then(res => {
            setLoading(false)
            window.location.reload();
        })
        .catch(err => {
            setLoading(false)
            setError({status:true,msg:err.response.data.msg});
        });
    }

    const patchUserPass = (e)=>{
        e.preventDefault();
        setLoading(true)
        setError({status:false});
        axios.patch(`${server}/api/v1/user/password-reset`,{currentPass,newPass,confirmNewPass},{withCredentials:true})
        .then(res => window.location.reload())
        .catch(err => {
            setLoading(false);
            setError({status:true,msg:err.response.data.msg})
        });
    }

    const sendEmailHandler = ()=>{
        setLoading(true)
        setError({status:false});
        axios.post(`${server}/api/v1/user/email-send`,{newEmail},{withCredentials:true})
        .then(res => {
            setLoading(false)
            setSendEmail(true)
        })
        .catch(err => {
            setLoading(false)
            setError({status:true,msg:err.response.data.msg});
        });
    }

    const patchUserEmail = (e)=>{
        e.preventDefault();
        setError({status:false});
        setLoading(true)
        axios.patch(`${server}/api/v1/user/email-reset`,{newEmail,verificationCode,password:currentPass},{withCredentials:true})
        .then(res => {
            setLoading(false);
            window.location.reload();
        })
        .catch(err => {
            setLoading(false);
            setError({status:true,msg:err.response.data.msg})
        });
    }

    useEffect(()=>{
        setError({status:false})
    },[emailModal,passowrdModal])

return <>
<div className={styles.main}>
    <div className="container">
    <Header showHomeLink={true} />
    <div className={styles.body}>
        <h2>Account Settings</h2>
        <p>Edit your username,avater,etc.</p>
        <div className={styles.holder}>
            <form onSubmit={pathUsername}>
                <div className={styles.formControl}>
                    <label>Username</label>
                    <input type="text" defaultValue={user.username} onChange={(e)=>setNewUsername(e.target.value)} />
                </div>
                <div className={styles.formControl}>
                    <label>Password</label>
                    <input type="password" placeholder="********" disabled />
                    <span onClick={()=> setPasswordModal(true)}>Change</span>
                </div>
                <div className={styles.formControl}>
                    <label>Email address</label>
                    <input type="email" value={user.email} disabled />
                    <span onClick={()=> setEmailModal(true)}>Change</span>
                </div>
                {loading ? <div className={styles.msg} style={{color:"black"}}><FontAwesomeIcon className="fa-spin" icon={faSpinner} /> </div> : error.status && <div className={styles.msg}><FontAwesomeIcon icon={faTriangleExclamation} /> {error.msg}</div>}
                <button type="submit">Save</button>
            </form>
            <div className={styles.profileImage}>
                <img src={user.image} alt="" />
                <div className={styles.upload}>
                    <input id="upload" type="file" style={{display:"none"}} />
                    <label htmlFor="upload">Upload a picture</label>
                </div>
            </div>
        </div>
    </div>
</div>
</div>

{passowrdModal && <SettingsModal closeModal={()=> setPasswordModal(false)}>
    <form onSubmit={patchUserPass}>
        <div className={styles.formControl}>
            <label>Current password</label>
            <input type="password" onChange={(e)=>setCurrentPass(e.target.value)} />
        </div>
        <div className={styles.formControl}>
            <label>New password</label>
            <input type="password" onChange={(e)=>setNewPass(e.target.value)} />
        </div>
        <div className={styles.formControl}>
            <label>Confirm password</label>
            <input type="password" onChange={(e)=>setConfirmNewPass(e.target.value)} />
        </div>
        {loading ? <div className={styles.msg} style={{color:"black"}}><FontAwesomeIcon className="fa-spin" icon={faSpinner} /> </div> : error.status && <div className={styles.msg}><FontAwesomeIcon icon={faTriangleExclamation} /> {error.msg}</div>}
        <button type="submit">Submit</button>
    </form>
</SettingsModal>}

{emailModal && <SettingsModal closeModal={()=> setEmailModal(false)}>
    <form onSubmit={patchUserEmail}>
        <div className={styles.formControl}>
            <label>New email address</label>
            <input type="email" value={newEmail} onChange={(e)=> setNewEmail(e.target.value)} />
        </div>
        {sendEmail && <>
            <div className={styles.formControl}>
            <label>Password</label>
            <input type="password" onChange={(e)=> setCurrentPass(e.target.value)} />
            </div>
            <div className={styles.formControl}>
            <label>Verification code</label>
            <input type="text" onChange={(e)=> setVerificationCode(e.target.value)} />
            <span onClick={sendEmailHandler}>Resend code</span>
            </div>
        </>}
        {loading ? <div className={styles.msg} style={{color:"black"}}><FontAwesomeIcon className="fa-spin" icon={faSpinner} /></div> : error.status && <div className={styles.msg}><FontAwesomeIcon icon={faTriangleExclamation} /> {error.msg}</div>}
        {sendEmail ? <button type="submit" onClick={patchUserEmail}>Submit</button> : <h5 onClick={sendEmailHandler}>Verify</h5>}
    </form>
</SettingsModal>}

</>

}