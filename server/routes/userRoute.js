const express = require("express"); //Comando para importar
const {registerUser, loginUser, findUser, getUsers} = require("../controllers/userController");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);



module.exports = router;
