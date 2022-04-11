import styles from "../styles/Main.module.css";
import Note from "./Note";
import axios from "axios"
import {server} from "../config";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";

export default function Main(){
    const {nNote,setNNote,updateNoteStatus,setUpdateNoteStatus,searchValue} = useContext(AppContext);
    const [notes,setNotes] = useState([]);
    const [noteContent,setNoteContent] = useState("");

    const createNote = (noteColor,noteContent)=>{
        setUpdateNoteStatus(false)
        axios.post(`${server}/api/v1/notes`,{color:noteColor,content:noteContent},{withCredentials:true})
        .then(res => {
            setUpdateNoteStatus(true)
            setNNote({status:false})
            setNoteContent("")
        })
        .catch(err => console.log(err))
    }

    const fetchNotes = ()=>{
        axios.get(`${server}/api/v1/notes`,{withCredentials:true})
        .then(res => {
            setNotes(res.data.results)
        })
        .catch(err => console.log(err));
    }

    useEffect(()=>{
        fetchNotes();
    },[updateNoteStatus])

return <div className={styles.main}>
    <h2>Notes</h2>
    <div className={styles.notes}>
        {nNote.status === true && 
         <Note  noteColor={nNote.data.color}
                noteContent={<textarea required autoFocus type="text" value={noteContent} onChange={(e)=> setNoteContent(e.target.value)} />}
                existNote={false}
                addNote={()=>createNote(nNote.data.color,noteContent)}
                closeNote={true}
         />
         }

       {(notes.length <= 0 && !nNote.status) ? <div style={{fontSize:14,fontWeight:"bold"}}>No notes to show ...</div> : notes.filter((note)=> note.content.includes(searchValue.toLowerCase()) || note.createdAt.substring(0,10).includes(searchValue)).map((note,index)=>{
           return <Note key={index}
                        noteId={note._id}
                        noteContent={note.content}
                        noteDate={note.updatedAt}
                        noteColor={note.color}
                        existNote={true}
                />
       })}
    </div>
</div>

}