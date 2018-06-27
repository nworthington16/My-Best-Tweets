var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const credentials = require("./credentials");
var Twit = require('twit');
var T = new Twit(credentials);

// console.log("The bot is working \n");
var params = {screen_name: '16nworthington', count: 200};
var count = 0;
var tweets = [];

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});

io.on('connection', function(socket) {
  T.get('statuses/user_timeline', params, callback);

  function callback(err, data, response) {
    for (let i = 0; i < params.count; i++) {
      var tweet = data[i];
      if (tweet !== undefined) {
        if (tweet.favorite_count > 8 && !tweet.hasOwnProperty("retweeted_status")) {
          tweets.push(tweet.text);
          socket.emit('sendTweet', {tweet: tweet.text + '\n'});
        }
        params.max_id = tweet.id - 1;
      }
    }
    count++;
    if (count < 16) {
      T.get('statuses/user_timeline', params, callback);
    }
  }
});



function printTweets() {
  for (let i = 0; i < tweets.length; i++) {
    console.log(tweets[i]);
    console.log("\n");
  }
}
