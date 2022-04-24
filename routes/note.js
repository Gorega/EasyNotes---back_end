const express = require("express");
const router = express.Router();
const {auth} = require("../auth/auth");
const {notes,createNote,patchNote,deleteNote} = require("../controllers/note");

router.route("/notes").get(auth,notes).post(auth,createNote);
router.route("/notes/update/:noteId").patch(auth,patchNote);
router.route("/notes/delete/:noteId").delete(auth,deleteNote);

module.exports = router;