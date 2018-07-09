var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const credentials = require("./credentials");
var Twit = require('twit');
var T = new Twit(credentials);

var params = {screen_name: '',
              count: 200,
              include_rts: false};
var count = 0;
var tweets = [];

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

io.on('connection', socket => {

    socket.on('request', data => {
        tweets = [];

        var screen_name = data.user;
        var num_likes = data.num_likes;
        var num_retweets = data.num_retweets;

        params.screen_name = screen_name;

        T.get('statuses/user_timeline', params, callback);

        function callback(err, data, response) {

            for (let i = 0; i < params.count; i++) {
                var tweet = data[i];
                if (tweet !== undefined) {
                    if (tweet.favorite_count >= num_likes
                        && tweet.retweet_count >= num_retweets) {
                            shortenedTweet = {tweet: tweet.text,
                                                     id: tweet.id_str,
                                                   user: tweet.user.screen_name,
                                                  likes: tweet.favorite_count,
                                               retweets: tweet.retweet_count,
                                                   date: tweet.created_at};
                            tweets.push(shortenedTweet);
                            io.emit('sendTweet', shortenedTweet);
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

    socket.on('sortBy', data => {
        var col = data.col;

        if (col === 'likesButton') {
            
            tweets.sort(function(a, b) {
                var aLikes = a.likes;
                var bLikes = b.likes;
                if (aLikes > bLikes) {
                    return 1;
                } else if (aLikes < bLikes) {
                    return -1;
                }
                return 0;
            });

            for (let i = tweets.length - 1; i >= 0; i--) {
                io.emit('sendTweet', tweets[i]);
            }

        } else if (col === 'retweetsButton') {

            tweets.sort(function(a, b) {
                var aRetweets = a.retweets;
                var bRetweets = b.retweets;
                if (aRetweets > bRetweets) {
                    return 1;
                } else if (aRetweets < bRetweets) {
                    return -1;
                }
                return 0;
            });

            for (let i = tweets.length - 1; i >= 0; i--) {
                io.emit('sendTweet', tweets[i]);
            }

        } else if (col === 'dateButton') {

            tweets.sort(function(a, b) {
                var aDate = (a.date.substring(a.date.length - 4, a.date.length)
                    + '-' + a.date.substring(4, 7)
                    + '-' + a.date.substring(8, 10));
                var bDate = (b.date.substring(b.date.length - 4, b.date.length)
                    + '-' + b.date.substring(4, 7)
                    + '-' + b.date.substring(8, 10));
                aDate = new Date(aDate);
                bDate = new Date(bDate);
                if (aDate > bDate) {
                    return 1;
                } else if (aDate < bDate) {
                    return -1;
                }
                return 0;
            });

            for (let i = tweets.length - 1; i >= 0; i--) {
                io.emit('sendTweet', tweets[i]);
            }

        }
    });

});

http.listen(3000, function() {
    console.log('listening on localhost:3000');
});
