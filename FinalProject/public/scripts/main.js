var rhit = rhit || {};

rhit.FB_COLLECTION_PERSONALINFORMATION = "PersonalInformation";//change
rhit.FB_KEY_FIRSTNAME = "Example";
rhit.FB_KEY_LASTNAME = "Example";
rhit.FB_KEY_EMAIL = "Example";
rhit.FB_KEY_VACCINE = "Example";
rhit.FB_KEY_ADDRESS = "Example";
rhit.FB_KEY_FIRSTDOSEDATE = "Example";
rhit.FB_KEY_FIRSTDOSETIME = "Example";
rhit.FB_KEY_SECONDDOSEDATE = "Example";
rhit.FB_KEY_SECONDDOSETIME = "Example";
rhit.FB_KEY_PHONENUMBER = "Example";

rhit.fbPhotoBucketManager = null;
rhit.fbSinglePhotoManager = null;
rhit.fbAuthManager = null;


function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}


rhit.FormPageController = class {
	constructor() {
		rhit.fbPhotoBucketManager.beginListening(this.updateList.bind(this));


		document.querySelector("#menuShowAllPhotos").addEventListener("click", (event) => {
			window.location.href = "/list.html";
		});

		document.querySelector("#menuShowMyPhotos").addEventListener("click", (event) => {
			window.location.href = `/list.html?uid=${rhit.fbAuthManager.uid}`;
		});

		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});



		$("#addPhotoDialog").on("show.bs.modal", () => {
			document.querySelector("#inputImageUrl").value = "";
			document.querySelector("#inputCaption").value = "";
		});

		$("#addPhotoDialog").on("shown.bs.modal", () => {
			document.querySelector("#inputImageUrl").focus();
		});

		document.querySelector("#submitAddPhoto").onclick = (event) => {
			const imageUrl = document.querySelector("#inputImageUrl").value;
			const caption = document.querySelector("#inputCaption").value;
			console.log(imageUrl, caption);
			rhit.fbPhotoBucketManager.add(imageUrl, caption);
		};

	}

	updateList() {
		const newList = htmlToElement("<div id='columns'></div>")
		for (let k = 0; k < rhit.fbPhotoBucketManager.length; k++) {
			const photo = rhit.fbPhotoBucketManager.getPhotoAtIndex(k);
			const newPin = this._createPin(photo);
			newPin.onclick = (event) => {
				console.log(` Save the id ${photo.id} then change pages`);
				window.location.href = `/photo.html?id=${photo.id}`;
			};
			newList.appendChild(newPin);
		}

		const oldList = document.querySelector("#columns");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}

	_createPin(photo) {
		return htmlToElement(
			`<div id="${photo.id}" class="pin">
				<img src="${photo.imageUrl}" alt="${photo.caption}">
				<p class="caption">${photo.caption}</p>
			</div>`
		);
	}
}

// dont think this has any paralels
// rhit.Photo = class {  dont think this has any paralels
// 	constructor(id, imageUrl, caption) {
// 		this.id = id;
// 		this.imageUrl = imageUrl;
// 		this.caption = caption;
// 	}
// }


rhit.FbPhotoBucketManager = class {
	constructor(uid) {
		this._uid = uid;
		this._documentSnapshots = [];
		this._unsubscribe = null;

		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PERSONALINFORMATION);
	}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50);
		console.log("test1");
		if (this._uid) {
			query = query.where(rhit.FB_KEY_AUTHOR, "==", this._uid);
			console.log("test3, rhit.FB_KEY_AUTHOR = ", rhit.FB_KEY_AUTHOR);
		}

		this._unsubscribe = query.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			console.log("Updated " + this._documentSnapshots.length + " photos.");

			changeListener();

		});
	}

	stopListening() {
		this._unsubscribe();
	}

	add(imageUrl, caption) {
		this._ref.add({
				[rhit.FB_KEY_IMAGEURL]: imageUrl,
				[rhit.FB_KEY_CAPTION]: caption,
				[rhit.FB_KEY_AUTHOR]: rhit.fbAuthManager.uid,
				[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(function (docRef) {
				console.log("Document added with ID: ", docRef.id);
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});
	}

	update(id, imageUrl, caption) {}

	delete(id) {}
	get length() {
		return this._documentSnapshots.length;
	}

	getPhotoAtIndex(index) {
		const doc = this._documentSnapshots[index];
		return new rhit.Photo(doc.id, doc.get(rhit.FB_KEY_IMAGEURL), doc.get(rhit.FB_KEY_CAPTION));
	}
}


rhit.FbInformationManager = class {
	constructor(uid) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PERSONALINFORMATION).doc(uid); // change "photoId"
	}

	beginListening(changeListener) {
		console.log("Listen for changes to this photo's caption");
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			console.log("Caption updated ", doc);
			if (doc.exists) {
				this._document = doc;
				changeListener();
			} else {
				console.log("Document does not exist any longer");
			}
		});
	}

	stopListening() {
		this._unsubscribe();
	}


	get name() {
		let fname = this._document.get(rhit.FB_KEY_FIRSTNAME);
		let lname = this._document.get(rhit.FB_KEY_LASTNAME);
		let name = fname + " " + lname;
		return name;
	}
	get email() {
		return this._document.get(rhit.FB_KEY_EMAIL);
	}
	get vaccineType() {
		return this._document.get(rhit.FB_KEY_VACCINE);
	}
	get address() {
		return this._document.get(rhit.FB_KEY_ADDRESS);
	}
	get firstDate() {
		return this._document.get(rhit.FB_KEY_FIRSTDOSEDATE);
	}
	get firstDoseTime() {
		return this._document.get(rhit.FB_KEY_FIRSTDOSETIME);
	}
	get secondDate() {
		return this._document.get(rhit.FB_KEY_SECONDDOSEDATE);
	}
	get secondDoseTime() {
		return this._document.get(rhit.FB_KEY_SECONDDOSETIME);
	}
	get phone() {
		return this._document.get(rhit.FB_KEY_PHONENUMBER);
	}


	// update(caption) {
	// 	this._ref.update({
	// 		[rhit.FB_KEY_CAPTION]: caption,
	// 		[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
	// 	}).then(() => {
	// 		console.log("Document updated");
	// 	});
	// }

	// delete() {
	// 	return this._ref.delete();
	// }
}

rhit.InformationPageController = class {
	constructor() {
		rhit.FbInformationManager.beginListening(this.updateView.bind(this));


		document.querySelector("#edit").onclick = (event) => {
			`/form.html?uid=${rhit.fbAuthManager.uid}`
		};

		document.querySelector("#logout").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});

		// maybe add a delete account option?
		// document.querySelector("#submitDeletePhoto").onclick = (event) => { 
		// 	rhit.FbInformationManager.delete().then(() => {
		// 		window.location.href = "/";
		// 	});;
		// };
	}

	updateView() {

		document.querySelector("#Name").innerHTML = rhit.FbInformationManager.name;
		document.querySelector("#Email").innerHTML = rhit.FbInformationManager.email; //might not be "innterHTML"
		document.querySelector("#Vaccine").innerHTML = rhit.FbInformationManager.vaccineType;
		document.querySelector("#TimeOne").innerHTML = rhit.FbInformationManager.firstDoseTime;
		document.querySelector("#DateOne").innerHTML = rhit.FbInformationManager.firstDate;
		document.querySelector("#AddressOne").innerHTML = rhit.FbInformationManager.addressOne;
		document.querySelector("#TimeTwo").innerHTML = rhit.FbInformationManager.secondDate;
		document.querySelector("#DateTwo").innerHTML = rhit.FbInformationManager.secondDoseTime;
		document.querySelector("#AddressTwo").innerHTML = rhit.FbInformationManager.addressTwo;
		document.querySelector("#Phone").innerHTML = rhit.FbInformationManager.phone;
	}
}





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



rhit.LoginPageController = class {
	constructor() {
		// do we want rosefire?
		document.querySelector("#rosefireButton").onclick = (event) => {
			rhit.fbAuthManager.signIn();
		}
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
	signIn() {
		// once again, do we want rosefire?
		Rosefire.signIn("2b1a3a21-a5ad-4f0c-b1a3-256bbf83e6f2", (err, rfUser) => {
			if (err) {
				console.log("Rosefire error!", err);
				return;
			}
			console.log("Rosefire success!", rfUser);
			firebase.auth().signInWithCustomToken(rfUser.token).catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				if (errorCode === 'auth/invalid-custom-token') {
					alert('The token you provided is not valid.');
				} else {
					console.error("Custom auth error", errorCode, errorMessage);
				}
			});
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

	// firebase.auth().onAuthStateChanged((user) => {
	// 	if (user) {
	// 		const displayName = user.displayName;
	// 		const email = user.email;
	// 		const photoURL = user.photoURL;
	// 		const phoneNumber = user.phoneNumber;
	// 		const isAnonymous = user.isAnonymous;
	// 		const uid = user.uid;

	// 	  	console.log("The user is signed in ", uid);
	// 		console.log('displayName :>> ', displayName);
	// 		console.log('email :>> ', email);
	// 		console.log('photoURL :>> ', photoURL);
	// 		console.log('phoneNumber :>> ', phoneNumber);
	// 		console.log('isAnonymous :>> ', isAnonymous);
	// 	  	// ...
	// 	} else {
	// 		console.log("The user is signed out");
	// 	  // User is signed out
	// 	  // ...
	// 	}
	//   });

	const inputEmailEl = document.querySelector("#inputEmail");
	const inputPasswordEl = document.querySelector("#inputPassword");

	// document.querySelector("#signOutButton").onclick = (event) => {

	// 	firebase.auth().signOut().then(() => {
	// 			console.log("You are now signed out");
	// 			// Sign-out successful.
	// 		}).catch((error) => {
	// 			console.log("Sign out error");
	// 			// An error happened.
	// 		});

	// 	console.log("Sign out");
	// };

	// document.querySelector("#createAccountButton").onclick = (event) => {
	// 	console.log(`Create account for email: ${inputEmailEl.value}, password: ${inputPasswordEl.value}`);
	// 	firebase.auth().createUserWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch((error) => {
	// 			var errorCode = error.code;
	// 			var errorMessage = error.message;
	// 			console.log("Create-account error ", errorCode, errorMessage);
	// 			// ..
	// 		});
	// };

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

main();