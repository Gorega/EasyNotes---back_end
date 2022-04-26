import styles from "../styles/pages/Settings.module.css";
import Header from "../components/Header";
import SettingsModal from "../components/SettingsModal";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { server } from "../config";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation,faSpinner } from "@fortawesome/free-solid-svg-icons";
import useForm from "../components/lib/useForm";

export default function Settings(){
    const {error,loading,setError,submitHandler} = useForm();
    const {user,fetchUserData} = useContext(AppContext);
    const [passowrdModal,setPasswordModal] = useState(false);
    const [emailModal,setEmailModal] = useState(false);
    const [currentPass,setCurrentPass] = useState(null);
    const [newPass,setNewPass] = useState(null);
    const [confirmNewPass,setConfirmNewPass] = useState(null);
    const [newEmail,setNewEmail] = useState(null);
    const [newUsername,setNewUsername] = useState(null);
    const [verificationCode,setVerificationCode] = useState(null);
    const [sendEmail,setSendEmail] = useState(false);
    const [avatarPreview,setAvatarPreview] = useState(null);
    const [avatarImage,setAvatarImage] = useState(null);
    const [avatarStatus,setAvatarStatus] = useState(null);

    const pathUsername = async (e)=>{
        e.preventDefault();
        const success = await submitHandler("patch",`${server}/api/v1/user/username-reset`,{newUsername:newUsername ? newUsername : user.username})
        if(success){
            window.location.reload();
        }
    }

    const patchUserPass = async (e)=>{
        e.preventDefault();
        const success = await submitHandler("patch",`${server}/api/v1/user/password-reset`,{currentPass,newPass,confirmNewPass})
        if(success){
            window.location.reload();
        }
    }

    const sendEmailHandler = async()=>{
        setSendEmail(false)
        const success = await submitHandler("post",`${server}/api/v1/user/email-send`,{newEmail})
        if(success){
            setSendEmail(true)
        }else{
            setSendEmail(false)
        }
    }

    const patchUserEmail = async (e)=>{
        e.preventDefault();
        const success = await submitHandler("patch",`${server}/api/v1/user/email-reset`,{newEmail,verificationCode,password:currentPass})
        if(success){
            window.location.reload();
        }

    }

    const getAvatarPreview = async (e)=>{
        setAvatarStatus("pending")
        const data = new FormData();
        data.append("avatar",e.target.files[0])
        axios.post(`${server}/api/v1/user/upload-avatar`,data)
        .then(res => {
            setAvatarStatus("fulfilled")
            setAvatarPreview(res.data.preview)
            setAvatarImage(e.target.files[0])
        })
        .catch(err => setAvatarStatus("rejected"))
    }

    const updateAvatar = async ()=>{
        setAvatarStatus("pending")
        const success = await submitHandler("patch",`${server}/api/v1/user/upload-avatar`,{avatar:avatarPreview})
        if(success){
            setAvatarStatus("fulfilled")
            setAvatarPreview(null);
        }else{
            setAvatarStatus("rejected")
        }
    }

    const deleteAvatar = async ()=>{
        setAvatarStatus("pending")
        const success = await submitHandler("delete",`${server}/api/v1/user/delete-avatar/${avatarPreview}`)
        if(success){
            setAvatarStatus("fulfilled")
            setAvatarPreview(null);
        }else{
            setAvatarStatus("rejected")
        }
    }

    useEffect(()=>{
        setError({status:false})
    },[emailModal,passowrdModal])

    useEffect(()=>{
        fetchUserData();
    },[avatarStatus])

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
                <div className={styles.avatar}>
                    {avatarStatus === "pending" ? <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> : <img src={`${server}/avaters/${avatarPreview ? avatarPreview : user.image}`} alt="" />}
                </div>
                <div className={styles.upload}>
                    <input id="upload" type="file" style={{display:"none"}} onChange={getAvatarPreview}/>
                    {avatarPreview ? <ul className={styles.patch}>
                        <li onClick={updateAvatar}>Save</li>
                        <li onClick={deleteAvatar}>Cancel</li>
                    </ul> : <label htmlFor="upload">Upload a picture</label>}
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