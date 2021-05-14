var rhit = rhit || {};

rhit.startFirebaseUI = function () {
	var uiConfig = {
		signInSuccessUrl: '/',
		signInOptions: [
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
			firebase.auth.PhoneAuthProvider.PROVIDER_ID,
			firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
		],
	};

	const ui = new firebaseui.auth.AuthUI(firebase.auth());
	ui.start('#firebaseui-auth-container', uiConfig);
}


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
		const uid = urlParams.get("uid");
		console.log("got url param - ", uid);
		rhit.fbPhotoBucketManager = new rhit.FbPhotoBucketManager(uid); // change
		new rhit.FormPageController();
	}


	if (document.querySelector("#informationPage")) {
		// this page will fill in the information of the user based on what is stored.

		const uid = urlParams.get("uid"); // can change maybe to just uid? might not be neccecary.

		rhit.FbInformationManager = new rhit.FbInformationManager(uid);
		new rhit.InformationPageController();
	}


	if (document.querySelector("#loginPage")) {
		new rhit.LoginPageController();
		rhit.startFirebaseUI();
	}
}

rhit.firebaseAuth = function() {
	document.querySelector("#exampleInputEmail1").onclick = (event) => {
		counter -= 1;
		updateView(); 
	};
	document.querySelector("#resButton").onclick = (event) => {
		counter = 0;
		updateView(); 
	};
	document.querySelector("#incButton").onclick = (event) => {
		counter += 1;
		updateView(); 
	};
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	const inputEmailEl = document.querySelector("#inputEmail");
	const inputPasswordEl = document.querySelector("#inputPassword");

	document.querySelector("#logInButton").onclick = (event) => {
		console.log(`Log in for email: ${inputEmailEl.value}, password: ${inputPasswordEl.value}`);
		firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("login error ", errorCode, errorMessage);
			});
	};
};

rhit.main();

function updateView() {
    document.querySelector("#counter").innerHTML = `Count = ${counter}`;
}
