const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken")

exports.userRegister = async (req, res) => {
    const { userEmail, userPassword,apiKey,apiSecretKey,accessToken,accessTokenSecret,rtCount,likeCount,followCount } = req.body;

    // Field Validation
    const validationErr = validationResult(req);
    console.log("validationErr", validationErr)
    if (validationErr.errors.length > 0) {
        return res.status(400).json({ errors: validationErr.array() });
    }

    // User exist check
    const userData = await User.findOne({ userEmail }); //userEmail:userEmail
    if (userData) {
        return res
            .status(400)
            .json({ errors: [{ message: "User already exists!!" }] }); // we can send it as res.json instead of res.send
    }

    // Password hash
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(userPassword, salt);

    // Save User
    const user = new User({
        userEmail,
        userPassword: newPassword,
        apiKey,
        apiSecretKey,
        accessToken,
        accessTokenSecret,
        rtCount,
        likeCount,
        followCount
    });
    await user.save();

    //TODO: Error handling for saving
    res.send("Register Completed.");
};

exports.userLogin = async (req, res) => {
    const { userEmail, userPassword } = req.body;
    // Field Validation
    const validationErr = validationResult(req);
    if (validationErr.errors.length > 0) {
        return res.status(400).json({ errors: validationErr.array() });
    }
    // User exist check
    const userData = await User.findOne({ userEmail });
    if (!userData) {
        return res
            .status(400)
            .json({ errors: [{ message: "User doesn't exists!!" }] });
    }
    // Password compare
    const isPasswordMatch = await bcrypt.compare(userPassword, userData.userPassword)
    if (!isPasswordMatch) {
        return res
            .status(400)
            .json({ errors: [{ message: "Invalid credentials" }] });
    }
    // JSON WEB TOKEN - JWT
    jwt.sign(
        { userData },
        process.env.JWT_SECRET_KEY,
        { expiresIn: 3600 },
        (err, token) => {
            console.log(token)
            if (err) {
                return res.status(400).json({ errors: [{ message: "Unknown Error" }] });
            }
            return res.status(202).json({ token });
        }
    );
    // res.send(token)
};

exports.getProfile = async (req, res) => {
    res.send(req.decodedUser);
}

exports.userUpdate = async (req,res) => {
    try {
        const user = await User.findOne({
            where:{
                id:req.params.id
            }
        });
        console.log("user!!!!!!!!!!!!!!!!!!!!!:",user);
        console.log("req.params.id",req.params.id);
        user.userEmail = req.body.userEmail;
        user.userPassword = req.body.userPassword;
        user.apiKey = req.body.apiKey;
        user.apiSecretKey = req.body.apiSecretKey;
        user.accessToken = req.body.accessToken;
        user.accessTokenSecret = req.body.accessToken;
        user.rtCount = req.body.rtCount;
        user.likeCount = req.body.likeCount;
        user.followCount = req.body.followCount;
        await user.save();
        
        res.send(user);
    } catch (error) {
        res.send(error);
    }
}