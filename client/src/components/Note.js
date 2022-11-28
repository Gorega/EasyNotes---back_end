import styles from "../styles/Note.module.css";
import axios from "axios"
import {server} from "../lib/config";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { faCheck, faEdit,faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AlertModal from "./AlertModal";

export default function Note(props){

    const {noteId,noteContent,noteDate,noteColor,existNote} = props;
    const {setUpdateNoteStatus,nNote,setNNote} = useContext(AppContext)
    const [showAlertModal,setShowAlertModal] = useState(false);
    const [editStatus,setEditStatus] = useState(false);
    const [noteText,setNoteText] = useState("");

    const createNote = ()=>{
        setUpdateNoteStatus(false)
        axios.post(`${server}/api/v1/notes`,{color:nNote.data.color,content:noteText},{withCredentials:true})
        .then(_ => {
            setUpdateNoteStatus(true)
            setNNote({status:false})
        })
    }

    const patchNote = ()=>{
        setUpdateNoteStatus(false)
        axios.patch(`${server}/api/v1/notes/update/${noteId}`,{content:noteText},{withCredentials:true})
        .then(_ => {
            setEditStatus(false)
            setUpdateNoteStatus(true);
            setNoteText(noteContent);
        })
    }

    const deleteNote = ()=>{
        if(nNote.status){
            setNNote({status:false});
        }else{
            setUpdateNoteStatus(false)
            axios.delete(`${server}/api/v1/notes/delete/${noteId}`,{withCredentials:true})
            .then(_ => {
                setShowAlertModal(false);
                setUpdateNoteStatus(true);
                setEditStatus(false);
            })
        }
    }

    useEffect(()=>{
        window.addEventListener("keyup",(e)=>{
            if(e.key == "Escape"){
                setNNote({status:false})
                setEditStatus(false)
            }
        })
        // update note content on edit after delete or create a new note
        setNoteText(noteContent)
    },[noteContent])

    return <div className={styles.note} style={{backgroundColor:noteColor}} noteid={noteId}>
        <div className={styles.text}>
        {(editStatus || nNote.status) ?
        <textarea
            className={styles.inputText}
            autoFocus
            type="text"
            value={noteText}
            onChange={(e)=> setNoteText(e.target.value)} />
        : 
        <textarea
            value={noteContent}
            spellCheck="false" />
        }
        </div>

        <div className={styles.footer}>
            <h4>{noteDate && noteDate.substring(0,10)}</h4>
            {existNote ? <div className={styles.control} onClick={()=>{
                if(editStatus){
                    patchNote();
                }else{
                    setEditStatus(true)
                }
            }}>
            {editStatus ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faEdit} />}
            </div>
            :
            <div className={styles.control} onClick={createNote}><FontAwesomeIcon icon={faCheck} /></div>}
        </div>
        {(editStatus || nNote.status) && <div className={styles.close} onClick={()=>setShowAlertModal(true)}>
            <FontAwesomeIcon icon={faTimes} />
        </div>}
        {showAlertModal
         &&
        <AlertModal
            onOk={deleteNote}
            onCancel={()=>setShowAlertModal(false)}
        />}
    </div>

}