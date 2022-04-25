const express = require("express");
const router = express.Router();
const {auth} = require("../auth/auth");
const {user,patchUsername,patchUserPass,sendEmail,patchUserEmail,sendResetPassMail,resetUserPass,uploadAvatarPreview,updateAvatar,deleteAvater} = require("../controllers/user");
const {activateAccount,register} = require("../controllers/register");
const login = require("../controllers/login");
const logout = require("../controllers/logout");
const multer  = require('multer')
const path = require("path");
const upload = multer({dest:path.join(__dirname,'../avaters')})

// const storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null,path.join(__dirname,'../avaters'))
//     },
//     filename: function(req,file,cb){
//         cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
//     }
// })

// const upload = multer({
//     storage:storage,
// }).single("avatar");

router.route("/user").get(auth,user);
router.route("/user/username-reset").patch(auth,patchUsername);
router.route("/user/password-reset").patch(auth,patchUserPass);
router.route("/user/email-send").post(sendEmail);
router.route("/user/email-reset").patch(auth,patchUserEmail)
router.route("/register").post(register);
router.route("/user/activate-account/:token").patch(activateAccount);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/user/email-reset-pass").post(sendResetPassMail);
router.route("/user/reset-pass/:token").patch(resetUserPass);
router.route("/user/upload-avatar").post(upload.single("avatar"),uploadAvatarPreview).patch(auth,updateAvatar);
router.route("/user/delete-avatar/:path").delete(auth,deleteAvater);

module.exports = router;