const express = require("express");
const path = require("path");
const router = express.Router();
const {auth} = require("../auth/auth");
const {user,patchUsername,patchUserPass,sendEmail,patchUserEmail,sendResetPassMail,resetUserPass,uploadAvatarPreview,updateAvatar,deleteAvater} = require("../controllers/user");
const {activateAccount,register} = require("../controllers/register");
const login = require("../controllers/login");
const logout = require("../controllers/logout");
const multer  = require('multer')
const upload = multer({dest:path.join(__dirname,'../avaters')})

router.route("/register").post(register).patch(activateAccount);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/user").get(auth,user);
router.route("/user/pass-reset").post(sendResetPassMail).patch(resetUserPass);
router.route("/user/email-reset").post(sendEmail).patch(auth,patchUserEmail)
router.route("/user/username-reset").patch(auth,patchUsername);
router.route("/user/password-reset").patch(auth,patchUserPass);
router.route("/user/avatar").post(upload.single("avatar"),uploadAvatarPreview).patch(auth,updateAvatar).delete(deleteAvater);

module.exports = router;