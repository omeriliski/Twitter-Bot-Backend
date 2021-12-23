const express = require("express");
const router = express.Router();
const TwitController = require("../controllers/TwitController");
const auth = require("../middleware/authMW");
//const CheckoutController = require("../controllers/CheckoutController")

//route=> /user

// router.post("/register",validations.emailPasswordValidation,UserController.userRegister);

// router.post("/login",validations.emailPasswordValidation,UserController.userLogin);

router.post("/twit",TwitController.twit);
router.post("/followPopular",TwitController.followPopular);
router.post("/listenTweets",TwitController.listenTweets);

module.exports = router;