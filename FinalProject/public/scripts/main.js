var rhit = rhit || {};

rhit.FB_COLLECTION_PERSONALINFORMATION = "PhotoBucket";
rhit.FB_KEY_FIRSTNAME = "";
rhit.FB_KEY_LASTNAME = "";
rhit.FB_KEY_EMAIL = "";
rhit.FB_KEY_VACCINE = "";
rhit.FB_KEY_ADDRESS = "";
rhit.FB_KEY_PHONENUMBER = "";
rhit.FB_KEY_FIRSTDOSEDATE = "";
rhit.FB_KEY_SECONDDOSEDATE = "";

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

		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PHOTOBUCKET);
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
	constructor(photoId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PERSONALINFORMATION).doc(photoId); // change "photoId"
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

	get imageUrl() {
		return this._document.get(rhit.FB_KEY_IMAGEURL);
	}

	get caption() {
		return this._document.get(rhit.FB_KEY_CAPTION);
	}

	get author() {
		return this._document.get(rhit.FB_KEY_AUTHOR);
	}


	update(caption) {
		this._ref.update({
			[rhit.FB_KEY_CAPTION]: caption,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		}).then(() => {
			console.log("Document updated");
		});
	}

	delete() {
		return this._ref.delete();
	}
}

rhit.InformationPageController = class {
	constructor() {
		rhit.FbSinglePhotoManager.beginListening(this.updateView.bind(this));


		document.querySelector("#submitEditPhoto").onclick = (event) => {
			`/form.html?uid=${rhit.fbAuthManager.uid}`
		};

		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});

		// maybe add a delete account option?
		// document.querySelector("#submitDeletePhoto").onclick = (event) => { 
		// 	rhit.FbSinglePhotoManager.delete().then(() => {
		// 		window.location.href = "/";
		// 	});;
		// };
	}

	updateView() {
		document.querySelector("#pinImageUrl").src = rhit.FbSinglePhotoManager.imageUrl;
		document.querySelector("#pinImageUrl").alt = rhit.FbSinglePhotoManager.caption;

		document.querySelector("#pinCaption").innerHTML = rhit.FbSinglePhotoManager.caption;


		if (rhit.FbSinglePhotoManager.author == rhit.fbAuthManager.uid) {
			document.querySelector("#menuEdit").style.display= "flex";
			document.querySelector("#menuDelete").style.display= "flex";
		}
	}
}





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
			// if (user) {
			// 	const displayName = user.displayName;
			// 	const email = user.email;
			// 	const photoURL = user.photoURL;
			// 	const phoneNumber = user.phoneNumber;
			// 	const isAnonymous = user.isAnonymous;
			// 	const uid = user.uid;
	
			// 	console.log("The user is signed in ", uid);
			// 	console.log('displayName :>> ', displayName);
			// 	console.log('email :>> ', email);
			// 	console.log('photoURL :>> ', photoURL);
			// 	console.log('phoneNumber :>> ', phoneNumber);
			// 	console.log('isAnonymous :>> ', isAnonymous);
			// 	  // ...
			// } else {
			// 	console.log("The user is signed out");
			// }
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




rhit.checkForRedirects = function() {
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
		window.location.href = `/information.html?uid=${rhit.fbAuthManager.uid}`;
	}
	if (!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/";
	}
}

rhit.initializePage = function() {
	const urlParams = new URLSearchParams(window.location.search);

	if(document.querySelector("#formPage")) {
		const uid = urlParams.get("uid");
		console.log("got url param - ", uid);
		rhit.fbPhotoBucketManager = new rhit.FbPhotoBucketManager(uid); // change
		new rhit.FormPageController();
	}


	if (document.querySelector("#informationPage")) {
		// this page will fill in the information of the user based on what is stored.

		const photoId = urlParams.get("id"); // can change maybe to just uid? might not be neccecary.
		
		rhit.FbSinglePhotoManager = new rhit.FbSinglePhotoManager(photoId);
		new rhit.InformationPageController();
	}


	if (document.querySelector("#loginPage")) {
		new rhit.LoginPageController();
		rhit.startFirebaseUI();
	}
}


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening((params) => {
		console.log("isSignedIn = ", rhit.fbAuthManager.isSignedIn);
		
		rhit.checkForRedirects();
		rhit.initializePage();
	});
};

rhit.main();