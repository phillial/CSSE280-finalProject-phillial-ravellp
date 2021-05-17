var rhit = rhit || {};
rhit.FB_COLLECTION_MOVIEQUOTE = "PersonalInformation";
rhit.FB_KEY_FIRSTNAME = "FirstName";
rhit.FB_KEY_LASTNAME = "LastName";
rhit.FB_KEY_EMAIL = "Email";
rhit.FB_KEY_PHONE = "PhoneNumber";
rhit.FB_KEY_ADDRESS = "address";
rhit.FB_KEY_ACCESSCALENDAR = "accessToCalendar"
rhit.FB_KEY_ACCESSPHONE = "accessToPhone"
rhit.FB_KEY_FIRSTDOSEDATE = "firstDoseDate";
rhit.FB_KEY_FIRSTDOSETIME = "firstDoseTime";
rhit.FB_KEY_SECONDDOSEDATE = "secondDoseDate";
rhit.FB_KEY_SECONDDOSETIME = "secondDoseTime";
rhit.FB_KEY_VACCINENAME = "vaccineName";
rhit.FB_KEY_UID = "uid";

rhit.personalInfo = null;

rhit.checkForRedirects = function () {
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
		window.location.href = `/information.html?uid=${rhit.fbAuthManager.uid}`;
	}
	if (!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/";
	}
	if (document.querySelector("#informationPage") && rhit.personalInfo == null) {
		console.log("big problems in info page, the personalInfo thing doesent exsist!");
		window.location.href = "/";
	}
}



rhit.initializePage = function () {
	const urlParams = new URLSearchParams(window.location.search);

	if (document.querySelector("#formPage")) {
		// Old code that will need to be updated if/when we make page-manager-class things
		// const uid = urlParams.get("uid");
		// console.log("got url param - ", uid);
		// rhit.fbPhotoBucketManager = new rhit.FbPhotoBucketManager(uid); // change
		// new rhit.FormPageController();
		

		const uid = urlParams.get("uid");
		if (uid) {
			// this._ref = firebase.firestore().collection("PersonalInformation"); //.doc(personalInfo.id);

			// let query = this._ref.orderBy(rhit.FB_KEY_FIRSTNAME, "desc").where(rhit.FB_KEY_UID, "==", uid);
			// this._unsubscribe = query.onSnapshot((querySnapshot) => {
			// 	this._doc = querySnapshot.docs[0];
			// 	const personalInfo = new rhit.PersonalInformation(this._doc.id, this._doc.get(rhit.FB_KEY_FIRSTNAME), this._doc.get(rhit.FB_KEY_LASTNAME),
			// 	this._doc.get(rhit.FB_KEY_EMAIL), this._doc.get(rhit.FB_KEY_PHONE), this._doc.get(rhit.FB_KEY_ADDRESS), this._doc.get(rhit.FB_KEY_FIRSTDOSEDATE), 
			// 	this._doc.get(rhit.FB_KEY_FIRSTDOSETIME), this._doc.get(rhit.FB_KEY_SECONDDOSEDATE), this._doc.get(rhit.FB_KEY_SECONDDOSETIME), 
			// 	this._doc.get(rhit.FB_KEY_VACCINENAME), this._doc.get(rhit.FB_KEY_UID) );
			// });
			this.fillInForm(personalInfo);
		}


		document.querySelector("#submitFormButton").onclick = function () {
			// might need this to sign in, will need to put the email and password field values	
			firebase.auth().createUserWithEmailAndPassword().catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("sign-in error ", errorCode, errorMessage);
			});
		}
	}


	if (document.querySelector("#informationPage")) {
		// Old code that will need to be updated if/when we make page-manager-class things
		// this page will fill in the information of the user based on what is stored.
		// const uid = urlParams.get("uid"); // can change maybe to just uid? might not be neccecary.
		// rhit.FbInformationManager = new rhit.FbInformationManager(uid);
		// new rhit.InformationPageController();


		this._ref = firebase.firestore().collection("PersonalInformation"); //.doc(uid)
		let query = this._ref.orderBy(rhit.FB_KEY_FIRSTNAME, "desc").where(rhit.FB_KEY_UID, "==", uid);
		
		
		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			// this._documentSnapshots = querySnapshot.docs;
			// console.log("Updated " + this._documentSnapshots.length + " quotes.");

			this._doc = querySnapshot.docs[0];
			const personalInfo = new rhit.PersonalInformation(this._doc.id, this._doc.get(rhit.FB_KEY_FIRSTNAME), this._doc.get(rhit.FB_KEY_LASTNAME),
			this._doc.get(rhit.FB_KEY_EMAIL), this._doc.get(rhit.FB_KEY_PHONE), this._doc.get(rhit.FB_KEY_ADDRESS), this._doc.get(rhit.FB_KEY_FIRSTDOSEDATE), 
			this._doc.get(rhit.FB_KEY_FIRSTDOSETIME), this._doc.get(rhit.FB_KEY_SECONDDOSEDATE), this._doc.get(rhit.FB_KEY_SECONDDOSETIME), 
			this._doc.get(rhit.FB_KEY_VACCINENAME), this._doc.get(rhit.FB_KEY_UID) );
			
			this.fillInForm(personalInfo);
			});

		document.querySelector("#Name").innerHTML = personalInfo.
		document.querySelector("#Email").innerHTML
		document.querySelector("#Vaccine").innerHTML
		
		document.querySelector("#DateOne").innerHTML
		document.querySelector("#TimeOne").innerHTML
		document.querySelector("#AddressOne").innerHTML
		// document.querySelector("#CityOne").innerHTML
		// document.querySelector("#StateOne").innerHTML
		
		document.querySelector("#DateTwo").innerHTML
		document.querySelector("#TimeTwo").innerHTML
		document.querySelector("#AddressTwo").innerHTML
		// document.querySelector("#CityTwo").innerHTML
		// document.querySelector("#StateTwo").innerHTML





		document.querySelector("#logout").onclick = function () {
			window.location.href = "/"
			console.log("logging out")
			firebase.auth().signOut().catch((error) => {
				console.log("Sign out error");
			});
		}

		document.querySelector("#edit").onclick = function () {
			const uid = urlParams.get("uid");
			// firebase.auth().
			window.location.href = `/form.html?uid=${uid}`;
			console.log("i am selecting sign up page")
		}
	}


	if (document.querySelector("#loginPage")) {
		// Old code that will need to be updated if/when we make page-manager-class things
		// new rhit.LoginPageController();

		document.querySelector("#signUpButton").onclick = function () {
			window.location.href = "/form.html"
			console.log("i am selecting sign up page")
		}


		document.querySelector("#logInButton").onclick = function () {
			var inputEmail = document.querySelector("#inputEmail");
			var inputPassword = document.querySelector("#inputPassword");

			this._user = firebase.auth().signInWithEmailAndPassword(inputEmail.value, inputPassword.value).then(() => {
				console.log(`Loging in with email: ${inputEmail.value}, password: ${inputPassword.value}`);
			}).catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("login error ", errorCode, errorMessage);
			});
			

			
			this._ref = firebase.firestore().collection("PersonalInformation");
			
			let query = this._ref.orderBy(rhit.FB_KEY_FIRSTNAME, "desc").where(rhit.FB_KEY_UID, "==", uid);
			
			this._unsubscribe = query.onSnapshot((querySnapshot) => {
				this._doc = querySnapshot.docs[0];
				rhit.personalInfo = new rhit.PersonalInformation(this._doc.id, this._doc.get(rhit.FB_KEY_FIRSTNAME), this._doc.get(rhit.FB_KEY_LASTNAME),
				this._doc.get(rhit.FB_KEY_EMAIL), this._doc.get(rhit.FB_KEY_PHONE), this._doc.get(rhit.FB_KEY_ADDRESS), this._doc.get(rhit.FB_KEY_FIRSTDOSEDATE), 
				this._doc.get(rhit.FB_KEY_FIRSTDOSETIME), this._doc.get(rhit.FB_KEY_SECONDDOSEDATE), this._doc.get(rhit.FB_KEY_SECONDDOSETIME), 
				this._doc.get(rhit.FB_KEY_VACCINENAME), this._doc.get(rhit.FB_KEY_UID) );
			});

			this._unsubscribe();
			window.location.href = `/information.html?uid=${this._user.i.user.uid}`;
		};
	}
	

}


rhit.PersonalInformation = class {
	constructor(id, firstName, lastName, email, phone, address, firstDoseDate, firstDoseTime, secondDoseDate, secondDoseTime, vaccine ) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phone = phone;
		this.address = address;
		this.firstDoseDate = firstDoseDate;
		this.firstDoseTime = firstDoseTime;
		this.secondDoseDate = secondDoseDate;
		this.secondDoseTime = secondDoseTime;
		this.vaccine = vaccine;
	}
}

// "firstName";
// rhit.FB_KEY_LASTNAME = "lastName";
// rhit.FB_KEY_EMAIL = "email";
// rhit.FB_KEY_PHONE = "phone";
// rhit.FB_KEY_ADDRESS = "address";
// rhit.FB_KEY_FIRSTDOSEDATE = "firstDoseDate";
// rhit.FB_KEY_FIRSTDOSETIME = "firstDoseTime";
// rhit.FB_KEY_SECONDDOSEDATE = "secondDoseDate";
// rhit.FB_KEY_SECONDDOSETIME = "secondDoseTime";
// rhit.FB_KEY_VACCINENAME = "vaccineName";
// rhit.FB_KEY_UID = "uid";






rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
	}

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();
		});
	}

	signIn(inputEmail, inputPassword) {
		return firebase.auth().signInWithEmailAndPassword(inputEmail.value, inputPassword.value).catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log("login error ", errorCode, errorMessage);
		});
	}
	signOut() {
		firebase.auth().signOut().catch((error) => {
			console.log("Sign out error");
		});
	}
	get isSignedIn() {
		return !!this._user;
	}
	get uid() {
		return this._user.uid;
	}
}



/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");


	export let scheduledFunctionPlainEnglish = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    	console.log('This will be run every 1 minutes!');
	});



	
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening((params) => {
		console.log("isSignedIn = ", rhit.fbAuthManager.isSignedIn);

		// rhit.checkForRedirects();
		rhit.initializePage();
	});
};

rhit.main();