var rhit = rhit || {};


rhit.main = function () {
	console.log("Ready");

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			const displayName = user.displayName;
			const email = user.email;
			const photoURL = user.photoURL;
			const phoneNumber = user.phoneNumber;
			const isAnonymous = user.isAnonymous;
			const uid = user.uid;

		  	console.log("The user is signed in ", uid);
			console.log('displayName :>> ', displayName);
			console.log('email :>> ', email);
			console.log('photoURL :>> ', photoURL);
			console.log('phoneNumber :>> ', phoneNumber);
			console.log('isAnonymous :>> ', isAnonymous);
		  	// ...
		} else {
			console.log("The user is signed out");
		  // User is signed out
		  // ...
		}
	  });

	const inputEmailEl = document.querySelector("#inputEmail");
	const inputPasswordEl = document.querySelector("#inputPassword");

	document.querySelector("#signOutButton").onclick = (event) => {

		firebase.auth().signOut().then(() => {
				console.log("You are now signed out");
				// Sign-out successful.
			}).catch((error) => {
				console.log("Sign out error");
				// An error happened.
			});

		console.log("Sign out");
	};

	document.querySelector("#createAccountButton").onclick = (event) => {
		console.log(`Create account for email: ${inputEmailEl.value}, password: ${inputPasswordEl.value}`);

		firebase.auth().createUserWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;

				console.log("Create-account error ", errorCode, errorMessage);
				// ..
			});

	};

	document.querySelector("#logInButton").onclick = (event) => {
		console.log(`Log in for email: ${inputEmailEl.value}, password: ${inputPasswordEl.value}`);

		firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;

				console.log("login error ", errorCode, errorMessage);
			});
	};

	document.querySelector("#anonymousAuthButton").onclick = (event) => {
		console.log(`Log in for email: ${inputEmailEl.value}, password: ${inputPasswordEl.value}`);

		firebase.auth().signInAnonymously().catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;

				console.log("login error ", errorCode, errorMessage);
		});
	};

	rhit.startFirebaseUI();
};

rhit.startFirebaseUI = function() {
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



rhit.main();
