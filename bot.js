const credentials = require("./credentials");
var Twit = require('twit');
var T = new Twit(credentials);

// console.log("The bot is working \n");

var params = {screen_name: '16nworthington', count: 200};

function doStuff(i, params) {
  if (i < 3200) {
    T.get('statuses/user_timeline', params, function(err, data, response) {

      for (let i = 0; i < params.count; i++) {
        var tweet = data[i];
        if (tweet !== undefined) {
          if (tweet.favorite_count > 10 && !tweet.hasOwnProperty("retweeted_status")) {
            console.log(tweet.text);
            console.log("\nid: ", tweet.id);
            console.log("\n");
          }
          params.max_id = tweet.id - 1;
        }
      }
      doStuff(i + params.count, params);
    });
  }
}

doStuff(0, params);
