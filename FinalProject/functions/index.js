const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions




// exports.scheduledFunctionPlainEnglish = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
//     console.log('This will be run every 5 minutes!');
// })

exports.scheduledFunctionPlainEnglish = functions.pubsub.schedule('every 2 weeks').onRun((context) => {
    console.log('This will be run every 5 minutes!');
})