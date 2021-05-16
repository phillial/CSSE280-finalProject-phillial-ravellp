var rhit = rhit || {};


// rhit.checkForRedirects = function () {
// 	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
// 		window.location.href = `/information.html?uid=${rhit.fbAuthManager.uid}`;
// 	}
// 	if (!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn) {
// 		window.location.href = "/";
// 	}
// }



rhit.initializePage = function () {
	const urlParams = new URLSearchParams(window.location.search);

	if (document.querySelector("#formPage")) {
		// Old code that will need to be updated if/when we make page-manager-class things
			// const uid = urlParams.get("uid");
			// console.log("got url param - ", uid);
			// rhit.fbPhotoBucketManager = new rhit.FbPhotoBucketManager(uid); // change
			// new rhit.FormPageController();


	}


	if (document.querySelector("#informationPage")) {
		// Old code that will need to be updated if/when we make page-manager-class things
			// this page will fill in the information of the user based on what is stored.
			// const uid = urlParams.get("uid"); // can change maybe to just uid? might not be neccecary.
			// rhit.FbInformationManager = new rhit.FbInformationManager(uid);
			// new rhit.InformationPageController();

		
		document.querySelector("#signUpButton").onclick = function(){
			window.location.href = "/form.html"
			console.log("i am selecting sign up page")
		}

		document.querySelector("#signUpButton").onclick = function(){
			window.location.href = "/form.html"
			console.log("i am selecting sign up page")
		}
	}


	if (document.querySelector("#loginPage")) {
		// Old code that will need to be updated if/when we make page-manager-class things
			// new rhit.LoginPageController();

	

		let inputEmail = document.querySelector("#inputEmail");
		let inputPassword = document.querySelector("#inputPassword");


		document.querySelector("#signUpButton").onclick = function(){
			window.location.href = "/form.html"
			console.log("i am selecting sign up page")
		}

		document.querySelector("#logInButton").onclick = function() {
			console.log(`Loging in with email: ${inputEmail.value}, password: ${inputPassword.value}`);
			firebase.auth().signInWithEmailAndPassword(inputEmail.value, inputPassword.value).catch((error) => {
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log("login error ", errorCode, errorMessage);
				});
		};
	}


}


// rhit.firebaseAuth = function() {
// 	document.querySelector("#exampleInputEmail1").onclick = (event) => {
// 		counter -= 1;
// 		updateView(); 
// 	};
// 	document.querySelector("#resButton").onclick = (event) => {
// 		counter = 0;
// 		updateView(); 
// 	};
// 	document.querySelector("#incButton").onclick = (event) => {
// 		counter += 1;
// 		updateView(); 
// 	};
// }



/* Main */
/** function and class syntax examples */ 
rhit.main = function () {
	console.log("Ready");

	// rhit.checkForRedirects();
	rhit.initializePage();
};

rhit.main();
