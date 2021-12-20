const express = require("express");
const { route } = require(".");
const router = express.Router();
const userRouter = require("./UserRouter");
const twitRouter = require("./twitRouter")

router.use("/user",userRouter);
router.use("/twitapi",twitRouter);
module.exports = router;