const express = require("express");
const chatRoomController = require("../controllers/chatRoom.js");

const router = express.Router();

router.post("/", chatRoomController.createChatRoom);
router.get("/:userId", chatRoomController.getChatRoomOfUser);
router.get("/:firstUserId/:secondUserId", chatRoomController.getChatRoomOfUsers);

module.exports = router;
