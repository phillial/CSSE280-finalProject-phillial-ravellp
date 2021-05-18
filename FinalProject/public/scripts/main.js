var rhit = rhit || {};
rhit.FB_COLLECTION_PERSONALINFORMATION = "PersonalInformation";
rhit.FB_COLLECTION_USERS = "Users";
rhit.FB_KEY_FIRSTNAME = "FirstName";
rhit.FB_KEY_LASTNAME = "LastName";
rhit.FB_KEY_EMAIL = "Email";
rhit.FB_KEY_PASSWORD = "Password";
rhit.FB_KEY_PHONE = "PhoneNumber";
rhit.FB_KEY_ADDRESS = "address";
rhit.FB_KEY_ACCESSPHONE = "accessToPhone"
rhit.FB_KEY_FIRSTDOSEDATE = "firstDoseDate";
rhit.FB_KEY_FIRSTDOSETIME = "firstDoseTime";
rhit.FB_KEY_SECONDDOSEDATE = "secondDoseDate";
rhit.FB_KEY_SECONDDOSETIME = "secondDoseTime";
rhit.FB_KEY_VACCINENAME = "vaccineName";
rhit.FB_KEY_UID = "uid";

rhit.fbAuthManager = null;
rhit.personalInfo = null;


// get the citation
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}


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

		const uid = urlParams.get("uid");
		if (uid) {
			this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PERSONALINFORMATION).doc(uid);		
			// this._unsubscribe = 
			this._unsubscribe = this._ref.onSnapshot(async function (docSnapshot) {
				this._doc = docSnapshot;

				const email = this._doc.get(rhit.FB_KEY_EMAIL); //will probably want to just get rid of that input
				// const password = will probably want to just get rid of that input
				const fname = this._doc.get(rhit.FB_KEY_FIRSTNAME);
				const lname = this._doc.get(rhit.FB_KEY_LASTNAME);
				const vaccine = this._doc.get(rhit.FB_KEY_VACCINENAME);
				const address = this._doc.get(rhit.FB_KEY_ADDRESS);
				const fdate = this._doc.get(rhit.FB_KEY_FIRSTDOSEDATE);
				const ftime = this._doc.get(rhit.FB_KEY_FIRSTDOSETIME);
				const sdate = this._doc.get(rhit.FB_KEY_SECONDDOSEDATE);
				const stime = this._doc.get(rhit.FB_KEY_SECONDDOSETIME)
				const phone = this._doc.get(rhit.FB_KEY_PHONE);

				document.querySelector("#email").value = email;
				document.querySelector("#fname").value = fname;
				document.querySelector("#lname").value = lname;
				document.querySelector("#address").value = address;
				document.querySelector("#firstDate").value = fdate;
				document.querySelector("#firstDoseTime").value = ftime;
				document.querySelector("#secondDate").value = sdate;
				document.querySelector("#secondDoseTime").value = stime;
				document.querySelector("#vaccineType").value = vaccine;
				document.querySelector("#phone").value = phone;
				
				document.querySelector("#emailPasswordContainer").hidden = true; //might not be right
				// document.querySelector("#password").disabled = true; //might not be right
			});
			// this._unsubscribe();

			document.querySelector("#submitFormButton").onclick = async function () {
				document.querySelector("#emailPasswordContainer").hidden = false;
				const fname = document.querySelector("#fname").value;
				const lname = document.querySelector("#lname").value;
				const email = document.querySelector("#email").value;
				const address = document.querySelector("#address").value;
				const fdate = document.querySelector("#firstDate").value;
				const ftime = document.querySelector("#firstDoseTime").value;
				const sdate = document.querySelector("#secondDate").value;
				const stime = document.querySelector("#secondDoseTime").value;
				const vaccine = document.querySelector("#vaccineType").value;
				const phone = document.querySelector("#phone").value;

				await firebase.firestore().collection(rhit.FB_COLLECTION_PERSONALINFORMATION).doc(uid).set({
					[rhit.FB_KEY_FIRSTNAME]: fname,
					[rhit.FB_KEY_LASTNAME]: lname,
					[rhit.FB_KEY_EMAIL]: email,
					[rhit.FB_KEY_PHONE]: phone,
					[rhit.FB_KEY_ADDRESS]: address,
					[rhit.FB_KEY_FIRSTDOSEDATE]: fdate,
					[rhit.FB_KEY_FIRSTDOSETIME]: ftime,
					[rhit.FB_KEY_SECONDDOSEDATE]: sdate,
					[rhit.FB_KEY_SECONDDOSETIME]: stime,
					[rhit.FB_KEY_VACCINENAME]: vaccine
				});
				// await firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
				// 	var errorCode = error.code;
				// 	var errorMessage = error.message;
				// 	console.log("sign-in error ", errorCode, errorMessage);
				// }).then((_user) => {
				// }).catch(function (error) {
				// 	console.error("Error adding document: ", error);
				// });			
				window.location.href = `/information.html?uid=${uid}`;
			}

		} else {
			document.querySelector("#submitFormButton").onclick = async function () {
				const fname = document.querySelector("#fname").value;
				const lname = document.querySelector("#lname").value;
				const email = document.querySelector("#email").value
				const address = document.querySelector("#address").value;
				const fdate = document.querySelector("#firstDate").value;
				const ftime = document.querySelector("#firstDoseTime").value;
				const sdate = document.querySelector("#secondDate").value;
				const stime = document.querySelector("#secondDoseTime").value;
				const vaccine = document.querySelector("#vaccineType").value;
				const phone = document.querySelector("#phone").value;
				const password = document.querySelector("#password").value;	

				await firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log("sign-in error ", errorCode, errorMessage);
				}).then((_user) => {
					firebase.firestore().collection(rhit.FB_COLLECTION_PERSONALINFORMATION).doc(_user.user.uid).set({
						[rhit.FB_KEY_FIRSTNAME]: fname,
						[rhit.FB_KEY_LASTNAME]: lname,
						[rhit.FB_KEY_EMAIL]: email,
						[rhit.FB_KEY_PHONE]: phone,
						[rhit.FB_KEY_ADDRESS]: address,
						[rhit.FB_KEY_FIRSTDOSEDATE]: fdate,
						[rhit.FB_KEY_FIRSTDOSETIME]: ftime,
						[rhit.FB_KEY_SECONDDOSEDATE]: sdate,
						[rhit.FB_KEY_SECONDDOSETIME]: stime,
						[rhit.FB_KEY_VACCINENAME]: vaccine
					});
				}).catch(function (error) {
					console.error("Error adding document: ", error);
				});			
				window.location.href = `/information.html?uid=${rhit.fbAuthManager.uid}`;
			}
		}
	}


	if (document.querySelector("#informationPage")) {

		const uid = urlParams.get("uid");

		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PERSONALINFORMATION).doc(uid);		
		
		this._unsubscribe = this._ref.onSnapshot((docSnapshot) => {
			this._doc = docSnapshot;
			// rhit.personalInfo = new rhit.PersonalInformation(this._doc.id, this._doc.get(rhit.FB_KEY_FIRSTNAME), this._doc.get(rhit.FB_KEY_LASTNAME),
			// this._doc.get(rhit.FB_KEY_EMAIL), this._doc.get(rhit.FB_KEY_PHONE), this._doc.get(rhit.FB_KEY_ADDRESS), this._doc.get(rhit.FB_KEY_FIRSTDOSEDATE), 
			// this._doc.get(rhit.FB_KEY_FIRSTDOSETIME), this._doc.get(rhit.FB_KEY_SECONDDOSEDATE), this._doc.get(rhit.FB_KEY_SECONDDOSETIME), 
			// this._doc.get(rhit.FB_KEY_VACCINENAME), this._doc.get(rhit.FB_KEY_UID) );

			document.querySelector("#Name").innerHTML = this._doc.get(rhit.FB_KEY_FIRSTNAME) + " " + this._doc.get(rhit.FB_KEY_LASTNAME);
			document.querySelector("#Email").innerHTML = this._doc.get(rhit.FB_KEY_EMAIL);
			document.querySelector("#Phone").innerHTML = this._doc.get(rhit.FB_KEY_PHONE);
			document.querySelector("#Vaccine").innerHTML = this._doc.get(rhit.FB_KEY_VACCINENAME);
			document.querySelector("#DateOne").innerHTML = this._doc.get(rhit.FB_KEY_FIRSTDOSEDATE);
			document.querySelector("#TimeOne").innerHTML = this._doc.get(rhit.FB_KEY_FIRSTDOSETIME);
			document.querySelector("#AddressOne").innerHTML = this._doc.get(rhit.FB_KEY_ADDRESS);
			document.querySelector("#DateTwo").innerHTML = this._doc.get(rhit.FB_KEY_SECONDDOSEDATE);
			document.querySelector("#TimeTwo").innerHTML =this._doc.get(rhit.FB_KEY_SECONDDOSETIME);
			document.querySelector("#AddressTwo").innerHTML = this._doc.get(rhit.FB_KEY_ADDRESS);
			});



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


		document.querySelector("#logInButton").onclick = async function () {
			var inputEmail = document.querySelector("#inputEmail");
			var inputPassword = document.querySelector("#inputPassword");
			

			await rhit.fbAuthManager.signIn(inputEmail, inputPassword);
			
			this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PERSONALINFORMATION);
			
			let query = this._ref.orderBy(rhit.FB_KEY_FIRSTNAME, "desc");
			query.where(rhit.FB_KEY_UID, "==", rhit.fbAuthManager.uid);
		


			window.location.href = `/information.html?uid=${rhit.fbAuthManager.uid}`;

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



rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
	}

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			if(!user) {
			    console.log("no user");	
			}
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

	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening((params) => {
		console.log("isSignedIn = ", rhit.fbAuthManager.isSignedIn);

		// rhit.checkForRedirects();
		rhit.initializePage();
	});
};

rhit.main();