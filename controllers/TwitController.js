var Twit = require('twit')
const axios = require("axios")

let T = new Twit({
    consumer_key: 'Nj15lkjs1eLHoChMeH9ZGErc6',
    consumer_secret: 'opymeMuZnkvF428RLYWkeYC7g7ijv1TEyRvIjhp0WTvFv8iRUx',
    access_token: '1096359974362640384-uG7YBLbM2G4iCgvuI3e1xGxiElXj4A',
    access_token_secret: 'EAOyxHuR316RuEgKYN4FvuUeZW7SxxseX4BdN2u5efgEQ',
    // AAAAAAAAAAAAAAAAAAAAABH19QAAAAAAw5wDFd8VzVeW%2FPio2nC03gA33UA%3D0BhhGzUyPnQu3Ci0VuoGvPsaNyxRBZZi3yNc0DDSn7mk3ckIyZ
    //timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
});
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
        console.log('getUserIdsByScreenName :>> ', res.data.map(e=>e.id));
        return res.data.map(e=>e.id)
        
    })
    .catch(err=>{
      console.log('getUserIdsByScreenName err :>> ', err);
    })
  }
exports.twit = async (req, res) => {
    const {text} = req.body;
    T.post('statuses/update', {
        status: text
    }, function (err, data, response) {
        console.log(data)
    })
    res.send("successfully twitted");
};

//   retweet a tweet with id '343360866131001345'
  const retweet=(id)=>{
    return new Promise((resolve,reject)=>{
      T.post('statuses/retweet/:id', { id: id }, function (err, data, response) {
          if(err){
              console.log('retweet err :>> ', err);
              resolve(0);
              //rt();
         } 
         else{
              console.log("Retweetted!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
              resolve(1);
              res.send(data)
              
         }
    }) 
  })
}
exports.followPopular = async (req,res) => {
    const {arr} = req.body;
    let url="https://api.twitter.com/1.1/users/lookup.json?screen_name=";
    arr.forEach((e)=>url+=e.substring(1)+",");
    axios.get(url,{
        headers:{
          "Authorization":`bearer ${bearerToken}`
        }
      })
      .then((res)=>{
        let userIdsArr = res.data.map(e=>e.id)
        let stream = T.stream('statuses/filter', {follow: userIdsArr})
        console.log('userIdsArr :>> ', userIdsArr);
        stream.on('tweet', function (tweet) {
            retweet(tweet.id_str);
            //follow(tweet.user.screen_name);
            console.log("retweeted PopulerPerson's Tweet");
        })
      })
      .catch(err=>{
        console.log('getUserIdsByScreenName err :>> ', err);
      })
}