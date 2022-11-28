import styles from "../styles/Main.module.css";
import axios from "axios"
import {server} from "../lib/config";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import Note from "./Note";

export default function Main(){
    const {nNote,updateNoteStatus,searchValue} = useContext(AppContext);
    const [notes,setNotes] = useState([]);

    const fetchNotes = ()=>{
        axios.get(`${server}/api/v1/notes`,{withCredentials:true})
        .then(res => {
            setNotes(res.data.results)
        })
    }

    useEffect(()=>{
        fetchNotes();
    },[updateNoteStatus])

return <div className={styles.main}>
    <h2>Notes</h2>
    <div className={styles.notes}>
        {nNote.status === true && <Note  noteColor={nNote.data.color} />}
        {(notes.length <= 0 && !nNote.status) ?
            <div style={{fontSize:14,fontWeight:"bold"}}>No notes to show ...</div>
            :
            notes
            .filter((note)=> note.content.includes(searchValue.toLowerCase()) || note.createdAt.substring(0,10).includes(searchValue))
            .map((note,index)=>{
            return <Note
                        key={index}
                        noteId={note._id}
                        noteContent={note.content}
                        noteDate={note.updatedAt}
                        noteColor={note.color}
                        existNote={true}
                    /> })}
    </div>
</div>

}