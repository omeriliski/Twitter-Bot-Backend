const express = require("express");
const router = express.Router();
const userRouter = require("./UserRouter");

router.use("/user",userRouter); 
// router.use("/product", productsRouter);

module.exports = router;