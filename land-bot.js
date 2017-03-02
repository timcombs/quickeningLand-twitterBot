/*
This twitter bot is based on the amazing tutorials and repository by Daniel Shiffman
https://github.com/CodingTrain/Rainbow-Code/tree/master/bots
*/

console.log('bot starting');

// imports & stores twit package in a JS object
var Twit = require('twit');

// imports API codes from config.js & stores them in a JS object
var config = require('./config');

// imports aphorisms - json notation
var landQuotes = require('./landQuotes');

// object with twitter authentication values
var T = new Twit (config);

//post function - server
// Setting up a user stream
var stream = T.stream('user');

// Anytime someone tweets this bot account
stream.on('tweet', tweetEvent);

function tweetEvent(eventMsg) {
  var replyto = eventMsg.in_reply_to_screen_name;
  var text = eventMsg.text;
  var from = eventMsg.user.screen_name;

  //checks that tweet is a reply
  if (replyto === 'quickeningLand') {

    //splits string into array of words
    //great place for a filter
    var tweetArray = text.split(' ');
    var paramArray =[];

    //pushes words into paramArray if they are > 5 characters long
    for (i = 1; i < tweetArray.length; i++) {
      if (tweetArray[i].length > 5) {
        paramArray.push(tweetArray[i]);
      }
    }

    //params is an object with the params array
    //count property is the number of the tweets that you get back
    var params = {
      q: paramArray,
      count: 1
    };

    //searches for tweet that contain parameters
    T.get('search/tweets', params, gotData);

    //tweets a response to
    function gotData(err, data, response) {
      var tweets = data.statuses;

      if (tweets == null || tweets.length < 1) {
        var newTweet = '@' + from + ' Turing would be proud of you.';
      }else {
        var newTweet = '@' + from + ' Glad you understand. ' + '@' + tweets[0].user.screen_name + ' is also tied into the machinic unconscious.';
      }

      tweetIt(newTweet);
    }
  }
}

// calling the tweetIt() function to send a tweet
function tweetIt(txt) {
  var tweet = {
    status: txt
  };

  T.post('statuses/update', tweet, tweeted);

  function tweeted(err, data, response) {
    if (err) {
      console.log('Something went wrong!');
    } else {
      console.log('It worked!');
    }
  }
}

// picks text to be tweeted
function quotePick() {
  var pick = (Math.floor(Math.random() * 232) + 1).toString();
  var quote = landQuotes[pick];
  console.log(quote);
  return quote;
}

// code to send tweets once a day.
setInterval(function(){tweetIt(quotePick());}, 1000*60*60*24);
