const credentials = require("./credentials");
var Twit = require('twit');
var T = new Twit(credentials);

// console.log("The bot is working \n");

var params = {screen_name: '16nworthington', count: 200};
// var lowest_id = 0;
// for (var i = 0; i < 4; i++) {
//   T.get('statuses/user_timeline', params, function(err, data, response) {
//     var tweet = data[186];
//     if (tweet !== undefined) {
//       console.log(tweet.text);
//       lowest_id = tweet.id;
//     }
//   });
//   console.log(i);
//   params.max_id = lowest_id;
// }
let promise = T.get('statuses/user_timeline', params, function(err, data, response) {
  console.log(data[0].text);
});
console.log(promise);
// params.max_id = 685875153008508900;
// T.get('statuses/user_timeline', params, function(err, data, response) {
//   console.log(data[0].text);
// });

// params.max_id = 685875153008508900;
// T.get('statuses/user_timeline', params, callback);
// console.log("Lowest ID: ", lowest_id);

function callback(err, data, response) {
  if (i < 16) {
    console.log("Inside if statement");
    for (var i = 0; i < params.count; i++) {
      var tweet = data[i];
      if (tweet !== undefined) {
        if (!tweet.hasOwnProperty("retweeted_status")) {
          if (tweet.favorite_count  > 10) {
            console.log(tweet.text);
            console.log("\nid: " + tweet.id);
            console.log("\n")
            lowest_id = tweet.id;
          }
        }
      }
    }
    params.max_id = lowest_id - 1;
    T.get('statuses/user_timeline', params, callback);
  }
}
