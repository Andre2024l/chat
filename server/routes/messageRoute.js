const express = require("express");
const { createMessage, getMessages } = require("../controllers/messageController");
const router = express.Router();

router.post("/", createMessage);
router.get("/:chaId", getMessages);

module.exports = router;