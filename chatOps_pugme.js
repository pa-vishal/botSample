////////////////////////////////////////////////////////////////////////////////
const accessToken = process.env.SPARK_TOKEN;
const { getPug } = require('./lib/getPug.js');
const { chatOpsLogger } = require('./lib/chatOpsLogger.js');
const { ciscoSparkGetPersonDetails } = require('./lib/ciscoSparkGetPersonDetails.js');
const moment = require('moment-timezone');
const chatDebug = true;
////////////////////////////////////////////////////////////////////////////////

function chatOps_pugMe(bot, message) {

    message.command = "pug Me"; // <--Set this value for acurate logging and reporting!

    let sparkMessage = []; // Initialize a clean message to start
    const horizontalLine = "---\n";
    const horizontalLineClose = "\n---\n";

    // Read the human's input
    const allArguments = message.text.replace(/\s+/g, " ");
    const Arg = allArguments.split(" ");
    // Argument chatDebugging
    if (chatDebug === true) { console.log("AllArguments: " + allArguments); } // See value of allArguments
    if (chatDebug === true) { console.log("Arg[0]: " + Arg[0]); } // See value of Arg[0]
    if (chatDebug === true) { console.log("Arg[1]: " + Arg[1]); } // See value of Arg[1]
    if (chatDebug === true) { console.log("Arg[2]: " + Arg[2]); } // See value of Arg[2]
    if (chatDebug === true) { console.log("Arg[3]: " + Arg[3]); } // See value of Arg[3]
    // Bot responds to the human:
    if (Arg[0] == undefined | Arg[1] == undefined) { //
        // Bad human! This command requires exactly two arguments!
        message.logLevel = "WARNING";
        let thisWarning = 'Sorry, **' + message.command + '** is not undertood by me yet.';
        bot.reply(message, thisWarning);
        return;
    }

    botAck = "Just a moment please while I fetch a pug for you";
    bot.reply(message, botAck);

    // Do the needful!
    ciscoSparkGetPersonDetails(message, function (error, person) {
        if (error) {
            message.logLevel = "CRITICAL";
            let thisReply = "Bummer... " + error;
            sparkMessage.push(thisReply);
            bot.reply(message, sparkMessage.join(''));
            chatOpsLogger(message, sparkMessage.join(''));
        } else {
            getPug(Arg[0], Arg[1], function (error, results) {
                if (error) {
                    message.logLevel = "ERROR";
                    let thisReply = "Bummer... " + error;
                    sparkMessage.push(thisReply);
                    bot.reply(message, sparkMessage.join(''));
                    chatOpsLogger(message, sparkMessage.join(''));
                } else {
                    sparkMessage.push("\n" + horizontalLine);
                    if (results == "404") {
                        message.logLevel = "WARNING";
                        let thisReply = "Hi " + message.user + ", here are the results:\n\n**" +  Arg[0] + "** could not be found, sorry!";
                        sparkMessage.push(thisReply);
                    } else {
                        let pug = JSON.parse(results).pug;  
                        var reply = {                       
                            "url": "http://24.media.tumblr.com/tumblr_lteechLckg1qb08qmo1_500.jpg",
                                    "image": true
                        }

                        //let thisReply = "Hi " + message.user + ", here are the results of that zipcode lookup:\n\n**" + zipPostCode + "**\n\n[" + zipPlace + " " + zipState + " " + zipPostCode + " " + zipCountry + "](http://www.google.com/maps/place/" + zipLatitude + "," + zipLongitude + ")";
                        sparkMessage.push(pug);
                    }
                    sparkMessage.push("\n" + horizontalLineClose);
                    bot.reply(message, sparkMessage.join(''));
                    chatOpsLogger(message, sparkMessage.join(''));
                }
            })
        }
    });

}
module.exports.chatOps_pugMe = chatOps_pugMe;
////////////////////////////////////////////////////////////////////////////////
