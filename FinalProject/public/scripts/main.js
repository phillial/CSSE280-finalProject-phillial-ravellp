var rhit = rhit || {};


rhit.checkForRedirects = function () {
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
		window.location.href = `/information.html?uid=${rhit.fbAuthManager.uid}`;
	}
	if (!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn) {
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
			this._ref = firebase.firestore().collection(PersonalInformation).doc(movieQuoteId)
		}



		document.querySelector("#submitFormButton").onclick = function(){
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

		
		document.querySelector("#logout").onclick = function(){
			window.location.href = "/"
			console.log("logging out")
			firebase.auth().signOut().catch((error) => {
				console.log("Sign out error");
			});
		}

		document.querySelector("#edit").onclick = function(){
			firebase.auth().
			window.location.href = "/form.html?uid="
			console.log("i am selecting sign up page")
		}
	}


	if (document.querySelector("#loginPage")) {
		// Old code that will need to be updated if/when we make page-manager-class things
			// new rhit.LoginPageController();

		document.querySelector("#signUpButton").onclick = function(){
			window.location.href = "/form.html"
			console.log("i am selecting sign up page")
		}


		document.querySelector("#logInButton").onclick = function() {
			var inputEmail = document.querySelector("#inputEmail");
			var inputPassword = document.querySelector("#inputPassword");

			firebase.auth().signInWithEmailAndPassword(inputEmail.value, inputPassword.value).then((i) => {
				console.log(`Loging in with email: ${inputEmail.value}, password: ${inputPassword.value}`);
				window.location.href = `/information.html?uid=${i.user.uid}`;
			}).catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("login error ", errorCode, errorMessage);
			});		
		};
	}


}


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
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening((params) => {
		console.log("isSignedIn = ", rhit.fbAuthManager.isSignedIn);
	
		// rhit.checkForRedirects();
		rhit.initializePage();
	});
};

rhit.main();
