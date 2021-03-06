const express = require("express")
require("dotenv").config();
const app = express();
const router = require("./routes/router");
const connectDB = require("./models/ConnectDB");
const cors = require("cors");
connectDB();

//req.body
app.use(express.json());

app.use("/api", router);

app.use(cors({origin: true, credentials: true}));;

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}


const port = process.env.PORT || 5000;
app.listen(port,() => {
  console.log(`I'm listening on port ${port}`);
});