const Note = require("../models/note");

async function notes(req,res){
    const {userId} = req.user;
    try{
        if(!userId){
            return res.status(401).json({msg:"Unathorized"});
        }
        const notes = await Note.find({createdBy:userId}).sort({createdAt:-1});
        return res.status(200).json({results:notes});
    }catch(err){
        return res.status(500).json({msg:"server error"});
    }
}

async function createNote(req,res){
    const {content,color} = req.body;
    const {userId} = req.user;
    try{
        if(!userId){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const note = await Note.create({content,color,createdBy:userId});
        return res.status(201).json(note);
    }catch(err){
        return res.status(500).json({msg:"server error"})
    }
}

async function patchNote(req,res){
    const {noteId} = req.params;
    const {content,color} = req.body;
    const {userId} = req.user;
    try{
        if(!userId){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const note = await Note.findOneAndUpdate({_id:noteId},{content,color,createdBy:userId});
        return res.status(201).json(note);
    }catch(err){
        return res.status(500).json({msg:"server error"})
    }
}

async function deleteNote(req,res){
    const {noteId} = req.params;
    const {userId} = req.user;
    try{
        if(!userId){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const note = await Note.findOneAndDelete({_id:noteId},{createdBy:userId});
        return res.status(201).json(note);
    }catch(err){
        return res.status(500).json({msg:"server error"})
    }
}

module.exports = {notes,createNote,patchNote,deleteNote};