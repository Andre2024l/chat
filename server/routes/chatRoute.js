const express = require("express");
const { findUserChats,createChat,findChat } = require("../controllers/chatController");
const router = express.Router();

router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;