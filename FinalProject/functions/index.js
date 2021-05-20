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
    // console.log("context: " + context);

    db.collection("PersonalInformation").get().then((querySnapshot) => {
        querySnapshot.forEach((_doc) => {
            // console.log(doc.id, " => ", doc.data());
            console.log("got into querySpanshot no problemo");
            const sendDate = _doc.get(secondDoseDate);
            const sendTime = _doc.get(secondDoseTime);
            console.log("just tryed a doc.get()");
            const curDate = firebase.firestore.Timestamp.toDate();
            console.log("just did a timestamp.toDate()");
            const curTime = firebase.firestore.Timestamp.fromDate(curDate).now();
            console.log("just did a timestamp.fromDate(curDate).now()");

            
            // console.log(_doc.get(FirstName) + " " + _doc.get(LastName) + ". Send-date: " + sendDate + ", send-time: ", sendTime);
            // console.log("Current Dime: " + curDate + "current time: " + curTime);

            // if ((curDate == sentDate) && ((curTime <= sendTime) && (curTime + 1 > sendTime)) ) { //might not be + 1 (minute)
            //     console.log("send");
            // } else {
            //     console.log("not time yet, dont send");
            // }
        });
    });



    // this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PERSONALINFORMATION);
    // let query = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc");
    // this._documentSnapshots = [];
    // this._unsubscribe = query.onSnapshot((querySnapshot) => {
    //     this._documentSnapshots = querySnapshot.docs;

    //     for(let k = 0; k < this._documentSnapshots.length; k++) {
    //         this._doc = this._documentSnapshots[k];
           
    //         const sendDate = this._doc.get(secondDoseDate);
    //         const sendTime = this._doc.get(secondDoseTime);

    //         const curDate = firebase.firestore.Timestamp.toDate();
    //         const curTime = firebase.firestore.Timestamp.fromDate(curDate).now();
            
            
    //         console.log(this._doc.get(FirstName) + " " + this._doc.get(LastName) + ". Send-date: " + sendDate + ", send-time: ", sendTime);
    //         console.log("Current Dime: " + curDate + "current time: " + curTime);

    //         if ((curDate == sentDate) && ((curTime <= sendTime) && (curTime + 1 > sendTime)) ) { //might not be + 1 (minute)
    //             console.log("send");
    //         } else {
    //             console.log("not time yet, dont send");
    //         }

                // db.doc().set({ ... });
    //     }
        
    // });

})