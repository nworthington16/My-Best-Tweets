//const credentials = require("./credentials");
require(['./credentials'], function(credentials) {
  console.log('cred working');
});

require(['twit'], function(twit) {
  console.log('twit working');
});
//var Twit = require('twit');
//var T = new Twit(credentials);

var params = {screen_name: '16nworthington', count: 200};
var count = 0;
var tweets = [];

function grabTweets() {
  //T.get('statuses/user_timeline', params, callback);
  console.log(10);
}

function callback(err, data, response) {
  for (let i = 0; i < params.count; i++) {
    var tweet = data[i];
    if (tweet !== undefined) {
      if (tweet.favorite_count > 8 && !tweet.hasOwnProperty("retweeted_status")) {
        tweets.push(tweet.text);
      }
      params.max_id = tweet.id - 1;
    }
  }
  count++;
  if (count < 16) {
    T.get('statuses/user_timeline', params, callback);
  } else {
    printTweets();
  }
}

function printTweets() {
  for (let i = 0; i < tweets.length; i++) {
    console.log(tweets[i]);
    console.log("\n");
  }
}
