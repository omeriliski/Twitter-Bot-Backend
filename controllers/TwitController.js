var Twit = require('twit')
const axios = require("axios")
const {userUpdateInternal}=require("../controllers/UserController");

const init = (user)=>{
    const T = new Twit({
        consumer_key: user.apiKey,
        consumer_secret: user.apiSecretKey,
        access_token: user.accessToken,
        access_token_secret: user.accessTokenSecret,
        // AAAAAAAAAAAAAAAAAAAAABH19QAAAAAAw5wDFd8VzVeW%2FPio2nC03gA33UA%3D0BhhGzUyPnQu3Ci0VuoGvPsaNyxRBZZi3yNc0DDSn7mk3ckIyZ
        timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
        strictSSL: true, // optional - requires SSL certificates to be valid.
    })
    return T;
}

const bearerToken="AAAAAAAAAAAAAAAAAAAAABH19QAAAAAAw5wDFd8VzVeW%2FPio2nC03gA33UA%3D0BhhGzUyPnQu3Ci0VuoGvPsaNyxRBZZi3yNc0DDSn7mk3ckIyZ"
const getUserIdsByScreenName = (arr)=>{
    let url="https://api.twitter.com/1.1/users/lookup.json?screen_name=";
    arr.forEach((e)=>url+=e.substring(1)+",")
    // console.log('url :>> ', url);
    axios.get(url,{
      headers:{
        "Authorization":`bearer ${bearerToken}`
      }
    })
    .then((res)=>{
        // console.log('getUserIdsByScreenName :>> ', res.data.map(e=>e.id));
        // return res.data.map(e=>e.id)
        // get element instead of it's id
        return e
    })
    .catch(err=>{
      console.log('getUserIdsByScreenName err :>> ', err);
    })
  }
exports.twit = async (req, res) => {
    const {text,activeUser} = req.body;
    const T = init(activeUser);
    T.post('statuses/update', {
        status: text
    }, function (err, data, response) {
        console.log(data)
    })
    res.send("successfully twitted");
};

//   retweet a tweet with id '343360866131001345'
  const retweet=(id,T,userData,res)=>{
    return new Promise((resolve,reject)=>{
      T.post('statuses/retweet/:id', { id: id }, function (err, data, response) {
          if(err){
              console.log('retweet err :>> ', err);
              resolve(0);
              //rt();
         } 
         else{
              userUpdateInternal(userData,res);
              console.log("Retweeted!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
              resolve(1);
         }
    }) 
  })
}
exports.followPopular = async (req,res) => {
    const {userData} = req.body;
    const T = init(userData);
    let userIdsArr = userData.popularAccountsList.map(e=>e.id)
    let stream = T.stream('statuses/filter', {follow: userIdsArr})
    //console.log('userIdsArr :>> ', userIdsArr);
    stream.on('tweet', function (tweet) {
      retweet(tweet.id_str,T,res);
        //follow(tweet.user.screen_name);
        console.log("retweeted PopularPerson's Tweet",tweet.text);
      })
}

// listen sending tweets
exports.listenTweets=(req,res)=>{
  const {userData} = req.body;
  userData.retweetedCount=0;
  const T = init(userData);
  if(userData.hashtagList.length>1){
    const stream = T.stream('statuses/filter', { track:userData.hashtagList})
    stream.on('tweet', function (tweet) {
      retweet(tweet.id_str,T,userData,res);
      // follow(tweet.user.screen_name);
      // console.log(tweet);
    })
  }
}