//This is the JS
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyA6lAnrX_QXvKtPf24I6jCnCArGpKn0JEI",
    authDomain: "foodyc-b964b.firebaseapp.com",
    databaseURL: "https://foodyc-b964b.firebaseio.com",
    projectId: "foodyc-b964b",
    storageBucket: "foodyc-b964b.appspot.com",
    messagingSenderId: "250975059042",
    appId: "1:250975059042:web:ed714e45d5c4a2bc89653b",
    measurementId: "G-L5TH0TDRME"
  };
  firebase.initializeApp(firebaseConfig);
  // Initialize Firebase
 // firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
//------------------------------------image upload----------------------------------------------
var imgURL;
function upload() {
    //get your select image
    var image = document.getElementById("image").files[0];
    //now get your image name
    var imageName = image.name;
    //firebase  storage reference
    //it is the path where yyour image will store
    var storageRef = firebase.storage().ref('images/' + imageName);
    //upload image to selected storage reference

    var uploadTask = storageRef.put(image);

    uploadTask.on('state_changed', function (snapshot) {
        //observe state change events such as progress , pause ,resume
        //get task progress by including the number of bytes uploaded and total
        //number of bytes
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload is " + progress + " done");
        document.getElementById('pBar').value = progress;

    }, function (error) {
        //handle error here
        console.log(error.message);
    }, function () {
        //handle successful uploads on complete

        uploadTask.snapshot.ref.getDownloadURL().then(function (downlaodURL) {
            //get your upload image url here...
            console.log(downlaodURL);
            imgURL = downlaodURL;
            document.getElementById('contactForm').style.display="block";
            document.getElementById('imgUpload').style.display="none";
            document.getElementById('upImage').src=downlaodURL;
        });
    });
}
//----------------------------------------firebase operation-------------------------------------
var d = new Date();
				//var u = Date.UTC(2012);
				document.getElementById("demo").innerHTML = d.getTime();



const Reviews = document.querySelector('#viewReviews');
const forms = document.querySelector('#addReviews');
const searchList = document.querySelector('#list');


//Add data
forms.addEventListener('submit', (e) => {
	e.preventDefault();
	db.collection('Reviews').add({
		Name: forms.Name.value,
		loaction: forms.city.value,
		About: forms.about.value, 
		Food: forms.food.value,
		Reviews: forms.reviews.value,
		Ratings: forms.ratings.value,
		AuthorName: forms.authorName.value,
		Email: forms.email.value,
		Phone: forms.phoneNumber.value,
		Photo: imgURL,
		Timestamp: forms.Timestamp.value,
	
	});
	forms.Name.value = '';
	forms.city.value = '';
	forms.about.value = '';
	forms.food.value = '';
	forms.reviews.value = '';
	forms.ratings.value = '';
	forms.Timestamp.value = '';
	forms.email.value = '';
	forms.phoneNumber.value = '';
	forms.Timestamp.value = '';
	setTimeout(function(){
   window.location.reload(1);
	}, 5000);




})






//create element and render reviews
function renderReviews(doc) {
	let li = document.createElement('div');
	let name = document.createElement('h2');
	let location = document.createElement('em');
	let boutt = document.createElement('p');
	let food = document.createElement('p');
	let reviews = document.createElement('p');
	let ratings = document.createElement('p');
	let authorName = document.createElement('p');
	let email = document.createElement('p');
	let phoneNumber = document.createElement('p');
	let photo = document.createElement('img');
	let cross = document.createElement('p');
	let reviewWrite = document.createElement('b');




	li.setAttribute('data-id', doc.id);
	name.textContent = doc.data().Name;
	location.textContent ="Location: " + doc.data().loaction;
	boutt.textContent ="It is a " + doc.data().About + ".";
	food.textContent ="We had tasted " +  doc.data().Food + ".";
	reviews.textContent =  doc.data().Reviews;
	ratings.textContent ="Ratings: " +  doc.data().Ratings;
	authorName.textContent ="This is a personal opinion of " +  doc.data().AuthorName + ".";
	email.textContent = doc.data().Email;
	phoneNumber.textContent = doc.data().Phone;
	photo.setAttribute('src', doc.data().Photo);
	photo.setAttribute("class", "testimoPics");
	cross.textContent = 'DELETE';
	reviewWrite.textContent ="Review"; 


	li.appendChild(photo);
	li.appendChild(name);
	li.appendChild(location);
	li.appendChild(boutt);
	li.appendChild(food);
	li.appendChild(reviewWrite);
	li.appendChild(reviews);
	li.appendChild(ratings);
	li.appendChild(authorName);
	li.appendChild(email);
	li.appendChild(phoneNumber);
	
	li.appendChild(cross);

	Reviews.appendChild(li);

	//delete data
	cross.addEventListener('click', (e) => {
		e.stopPropagation();
		let id = e.target.parentElement.getAttribute('data-id');
		db.collection('Reviews').doc(id).delete();
	})

}




//get data from firebase
// db.collection('Reviews').orderBy('Name').get().then((snapshot) => {
// 	snapshot.docs.forEach(doc => {
// 		console.log(doc.data())
// 		renderReviews(doc);	
// 	})
// })
//realtime listener
db.collection('Reviews').orderBy('Timestamp', 'desc').onSnapshot(snapshot =>{
	let changes = snapshot.docChanges();
	console.log (changes);
	changes.forEach(change => {
		if(change.type == 'added'){
			renderReviews(change.doc);

		} else if (change.type == 'removed'){
            let li = Reviews.querySelector('[data-id=' + change.doc.id + ']');
            Reviews.removeChild(li);
        }
	})
})