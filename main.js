var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const credentials = require("./credentials");
var Twit = require('twit');
var T = new Twit(credentials);

var params = {screen_name: '', count: 200};
var count = 0;
var tweets = [];

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

io.on('connection', function(socket) {

    socket.on('request', function(data) {
        params.screen_name = data.user;
        var num_likes = data.num_likes;
        var num_retweets = data.num_retweets;

        T.get('statuses/user_timeline', params, callback);

        function callback(err, data, response) {

            for (let i = 0; i < params.count; i++) {
                var tweet = data[i];
                if (tweet !== undefined) {
                    if (tweet.favorite_count >= num_likes
                        && tweet.retweet_count >= num_retweets
                        && !tweet.hasOwnProperty("retweeted_status")) {
                        tweets.push(tweet);
                        io.emit('sendTweet', {tweet: tweet.text,
                                                 id: tweet.id_str,
                                               user: tweet.user.screen_name,
                                              likes: tweet.favorite_count,
                                           retweets: tweet.retweet_count,
                                             replys: tweet.reply_count});
                    }
                    params.max_id = tweet.id - 1;
                }
            }

            count++;

            if (count < 16) {
                T.get('statuses/user_timeline', params, callback);
            } else {
                count = 0;
                params.max_id = tweets[0].id;
            }
         }
    });

});

http.listen(3000, function() {
    console.log('listening on localhost:3000');
});
