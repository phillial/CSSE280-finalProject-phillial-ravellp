// functions:
const functions = require("firebase-functions");

// firestore:
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Email:
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'digitalvaccinereminder@gmail.com',
        pass: 'AveryPavani'
    }
});

// Twillio:
// var twilio = require('twilio');
// // Find your account sid and auth token in your Twilio account Console.
// var client = new twilio('AC8e0613e1fd74bb2e58248d1bc9d6f86e', '7acc375a314783c88f09219b84f62fe7');


exports.scheduledFunctionPlainEnglish = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    // console.log('This will be run every minute!');

    const dn = Date.now();

    db.collection("PersonalInformation").get().then((querySnapshot) => {
        querySnapshot.forEach((_doc) => {
            const fName = _doc.get("FirstName");
            const lName = _doc.get("LastName");
            const sendDate = _doc.get("secondDoseDate");
            const sendTime = _doc.get("secondDoseTime");
            
            console.log(fName + " " + lName + ". Send-date: " + sendDate + ", send-time: ", sendTime);
            

            const temp = sendDate + " " + sendTime + " EDT";
            const sd = Date.parse(temp);
            const dif = sd - dn;

            if ((0 <= dif) && (dif <= 70000)) {
                console.log("send");
                const email = _doc.get("Email");
                const vaccine = _doc.get("vaccineName");
                const addressOne = _doc.get("addressOne");
                const addressTwo = _doc.get("addressTwo");
                const firstT = _doc.get("firstDoseDate");
                const firstD = _doc.get("firstDoseTime");
                // const phoneAccess = _doc.get("phoneAccess");


                // Email part:
                var mailOptions = {
                    from: 'digitalvaccinereminder@gmail.com',
                    to: email,
                    subject: 'Your Vaccine Reminder Email',
                    text: "Hello, " + fName + " " + lName + ", you reported that you recieved your first dose of the " +
                        vaccine + " vaccine at " + firstT + " " + firstD + ", at the adress: " +
                        addressOne + ". You said you would be getting your second dose today, at " +
                        sendTime + " " + sendDate + ", at the adress: " + addressTwo + "."
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });


                // Twillio part:
                // console.log("phoneAccess: " + phoneAccess);
                // if (phoneAccess) {
                //     // console.log("Signed up for text notifications");
                //     // Send the text message.
                //     client.messages.create({
                //         to: '+15714476016',
                //         from: '+18436957763',
                //         body: 'Hello from Twilio!'
                //         // "Hello, " + fName + " " + lName + ", you reported that you recieved your first dose of the " +
                //         //     vaccine + " vaccine at " + firstT + " " + firstD + ", at the adress: " +
                //         //     addressOne + ". You said you would be getting your second dose today, at " +
                //         //     sendTime + " " + sendDate + " (today, in about ___ minutes), at the adress: " + addressTwo + "."
                //     })
                //     .then((message) => console.log(message.sid)); 
                // } else {
                //     console.log("Not signed up for text notifications");
                // }

            } else {
                console.log("not time yet, dont send");
            }
        });
    });
})