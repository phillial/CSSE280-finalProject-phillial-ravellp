const functions = require("firebase-functions");

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// exports.scheduledFunctionPlainEnglish = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
//     console.log('This will be run every 5 minutes!');
// })

exports.scheduledFunctionPlainEnglish = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    console.log('This will be run every minute!');

    const dn = Date.now();

    db.collection("PersonalInformation").get().then((querySnapshot) => {
        querySnapshot.forEach((_doc) => {
            const sendDate = _doc.get("secondDoseDate");
            const sendTime = _doc.get("secondDoseTime");
            console.log(_doc.get("FirstName") + " " + _doc.get("LastName") + ". Send-date: " + sendDate + ", send-time: ", sendTime);
            const temp = sendDate + " " + sendTime;
            const sd = Date.parse(temp);

            if ( (dn <= sd) && (dn + 60000 > sd) ) { 
                console.log("send");
                const fName = _doc.get("FirstName");
                const lName = _doc.get("LastName");
                const vaccine = _doc.get("vaccineName");
                const addressOne = _doc.get("addressOne");
                const addressTwo = _doc.get("addressTwo");
                const firstT = _doc.get("firstDoseDate");
                const firstD = _doc.get("firstDoseTime");


                Email.send({
                    Host: "smtp.gmail.com",
                    Username: "digitalvaccinereminder@gmail.com",
                    Password: "AveryPavani",
                    
                    From: "digitalvaccinereminder@gmail.com",
                    To: 'digitalvaccinereminder@gmail.com ',
                    Subject: "Your Vaccine Reminder Email",
                    Body: "Hello, " + fName + " " + lName + ", you reported that you recieved your first dose of the " 
                        + vaccine + " vaccine at " + firstT + " " + firstD + ", at the adress: " 
                        + addressOne + ". You said you would be getting your second dose today, at " 
                        + sendTime + " " + sendDate + " (today, in about ___ minutes), at the adress: " + addressTwo + "."
                }).then((message) => {
                       alert("mail sent successfully")
                });


                // twillio part
                // if (_doc.get("phoneAccess").value) {
                //     // phone number (might be in string format):  _doc.get("PhoneNumber"); 
                // }
            } else {
                console.log("not time yet, dont send");
            }
        });
    });
})