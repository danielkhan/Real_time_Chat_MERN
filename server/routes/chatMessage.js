const express = require("express");
const chatMessageController = require("../controllers/chatMessage.js");

const router = express.Router();

router.post("/", chatMessageController.createMessage);
router.get("/:chatRoomId", chatMessageController.getMessages);

module.exports = router;
