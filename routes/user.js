const express = require("express");
const router = express.Router();
const auth = require("../auth/auth");
const user = require("../controllers/user");
const register = require("../controllers/register");
const login = require("../controllers/login");
const logout = require("../controllers/logout");


router.route("/user").get(auth,user);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

module.exports = router;