var jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  //get Token
  const token = req.header("token");
  console.log("auth token!!!!!!!!!!!", token)
  //Return error if token doesn't exist
  if (!token) {
    return res.status(401).json({ msg: "No Token" });
  }

  //Verify token, !!!decodedToken
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ msg: "Invalid Token" });
    } else {
      req.decodedUser = decodedToken.userData;
      console.log("decodedToken.userData!!!!!!!!!!!!!!!!!!!!!!!!",decodedToken.userData);
      next();
    }
  });
};

module.exports = authMiddleware;