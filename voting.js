var T = localStorage.getItem("VOTING STAT");
//---------------------------------------GET FIRESTORE DATA ON AUTH--------------------------------------------------------//
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById("logoutFormShow").style.display = "block";
        document.getElementById("logInFormClose").style.display = "none";
        var what = localStorage.setItem("source", document.referrer);
        var wtf = localStorage.getItem("source");
        var accountDetails = document.getElementById("accountDetails");
        accountDetails.innerHTML = "logged in with " + user.email;
        
        //-----------------confirming voting code----------------
        const confirmVotingCode = document.querySelector('#enterVotingCode');
        confirmVotingCode.addEventListener('submit', (e) => {
            e.preventDefault();
            db.collection("VotingStat").doc(user.uid).set({
                    source: wtf,
                    status: "Opted for Voting",
                    votingCode: confirmVotingCode.code.value,
                }, {
                    merge: true
                })
                .then(function() {
                    console.log("VOTING CODE SAVED");
                    localStorage.removeItem("source");
                    location.reload();
                })
                .catch(function(error) {
                    console.error("VOTING CODE NOT SAVED ", error);
                });

        });
        //------------------confirm voting code----------------------
        var user = firebase.auth().currentUser;
        db.collection("VotingStat").doc(user.uid).get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                console.log("IT WILL CHANGE YOUR LIFE", doc.data().status);
                if (doc.data().status == "USER HAS VOTED") {
                    console.log("OHHHHH MY GODDDDD!");
                    document.getElementById("showvoting").style.display = "none";
                    document.getElementById("enterVotingCode").style.display = "none";
                    document.getElementById("pollingstatus").innerHTML = "You have voted successfully!";
                } else {
                    document.getElementById("enterVotingCode").style.display = "none";
                    document.getElementById("pollingstatus").innerHTML = "";
                }
            } else {
                document.getElementById("enterVotingCode").style.display = "block";
                document.getElementById("showvoting").style.display = "none";
                document.getElementById("pollingstatus").innerHTML = "";
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });


        db.collection('VOTING').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            console.log(changes);
            changes.forEach(change => {
                if (change.type == 'added') {
                    showvotes(change.doc);

                }
            })
        });
        if (T != null) {
            console.log("USER HAS ALREADY VOTED");
            db.collection("VotingStat").doc(user.uid).set({
                    uid: firebase.auth().currentUser.uid,
                    status: "USER HAS VOTED",
                }, {
                    merge: true
                })
                .then(function() {
                    console.log("VOTING STAT UPDATED YES");
                })
                .catch(function(error) {
                    console.error("VOTING STAT UPDATE YES ERROR ", error);
                });

        } else {
            console.log("USER HAS NOT VOTED YET");
        }
        //IF EMAIL VERIFIED DO SOMETHING
        if (user.emailVerified) {
            document.getElementById("showemailVerifictaiuonStatus").innerHTML = "Your email is Verified :)";
            document.getElementById("showToVerifiedUsersOnly").style.display = "block";
            console.log("Linkin Park", "USER IS EMAIL VERIFIED");
        }else{
           console.log('user logged in', user, "USER IS NOT EMAIL VERIFIED"); 
           document.getElementById("showToVerifiedUsersOnly").style.display = "none";
           document.getElementById("showemailVerifictaiuonStatus").innerHTML = "Your email is not Verified. First Complete email Verification. Visit Account Page for Other Details.";
        }
        

    } else {
        var accountDetails = document.getElementById("accountDetails");
        accountDetails.innerHTML = "you are not logged in";
        document.getElementById("logoutFormShow").style.display = "none";
        document.getElementById("logInFormClose").style.display = "block";
        console.log('user logged out');
        document.getElementById("showToVerifiedUsersOnly").style.display = "none";
        document.getElementById("showemailVerifictaiuonStatus").innerHTML = "You must login with your Account";
    }
});

//---------------------------------------SIGNUP--------------------------------------------------------//
//sign Up new Users
const error = document.querySelector('.error');
const signUpForm = document.querySelector('#signUp');
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //user info
    const email = signUpForm['signUpEmail'].value;
    const pass = signUpForm['signUpPass'].value;

    //signup the user
    auth.createUserWithEmailAndPassword(email, pass).then(cred => {
        console.log(cred);
        signUpForm.reset();
        var user = firebase.auth().currentUser;

        user.sendEmailVerification().then(function() {
            // Email sent.
            console.log("email verification sent")
        }).catch(function(error) {
            // An error happened.
        });
        // signUpForm.document.querySelector('.error').innerHTML = "";
        error.innerHTML = '';
    }).catch(err => {
        console.log(err.message)
        // signUpForm.document.querySelector('.error').innerHTML = err.message;
        error.innerHTML = err.message + " " + err.code;
    });

});

//-----------------------------------------LOGOUT------------------------------------------------------//
//Logout a user
const logOutForm = document.querySelector('#logOut');
logOutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('user logged out');
    });
});

//-----------------------------------------LOGIN------------------------------------------------------//
//Login a User
const logInForm = document.querySelector('#loginForm');
logInForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user infos
    const email = logInForm['logInEmail'].value;
    const pass = logInForm['logInPass'].value;

    //login user
    auth.signInWithEmailAndPassword(email, pass).then(cred => {
        console.log(cred.user);
        logInForm.reset();
        
        document.getElementById("accountSection").style.display = "none";
    });
});




//--------------------VOTING ALGORITHM--------------------------------------

var reqs_id = 0;
const showvotesrender = document.querySelector('#showvoting');
const showvotes = (doc) => {

    let li = document.createElement('div');
    let name = document.createElement('h2');
    let votes = document.createElement('h4');
    let votesTXT = document.createElement('h3');

    reqs_id++;
    li.setAttribute("class" , "eachcanddata");
    votes.setAttribute("id", "votemaster" + reqs_id);
    votesTXT.setAttribute("id", "votemasterBot" + reqs_id);
    li.setAttribute('id', doc.id)
    name.textContent =  doc.data().Name;
    votesTXT.textContent = "VOTE";
    votes.textContent = doc.data().Votes;

    li.appendChild(name);
    li.appendChild(votes);
    li.appendChild(votesTXT);
    // li.appendChild(email);


    showvotesrender.appendChild(li);
};



function newLoad() {
    var one = document.getElementById("votemasterBot1");
    var two = document.getElementById("votemasterBot2");
    one.onclick = function() {
        var x = document.getElementById("votemaster1").parentNode.id;
        var y = document.getElementById("votemaster1").innerHTML;
        y++;
        console.log(x);
        // console.log(y++, "yeah yeah yeha yeah")
        db.collection("VOTING").doc(x).set({
                Votes: y++,
            }, {
                merge: true
            })
            .then(function() {
                console.log("Document successfully written!");
                location.reload();
                localStorage.setItem("VOTING STAT", "VOTED");
            })
            .catch(function(error) {
                document.getElementById("voteError").innerHTML = "You didn't visited from facebook";
                console.error("Error writing document: ", error);
            });
    }
    two.onclick = function() {
        var x = document.getElementById("votemaster2").parentNode.id;
        var y = document.getElementById("votemaster2").innerHTML;
        y++;
        console.log(x);
        // console.log(y++, "yeah yeah yeha yeah")
        db.collection("VOTING").doc(x).set({
                Votes: y++,
            }, {
                merge: true
            })
            .then(function() {
                console.log("Document successfully written!");
                localStorage.setItem("VOTING STAT", "VOTED");
                location.reload();
            })
            .catch(function(error) {
                document.getElementById("voteError").innerHTML = "You didn't visited from facebook";
                console.error("Error writing document: ", error);
            });
    }
}

document.addEventListener('readystatechange', event => {

    if (event.target.readyState === "interactive") {
        console.log("loading...");


    }

    if (event.target.readyState === "complete") {
        console.log("loaded!");
        setTimeout(newLoad, 4000);
    }
});


function openAccset() {
  var x = document.getElementById("accountSection");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}


function opensignUpForm() {
    document.getElementById("signUpFormOpen").style.display = "block";
    document.getElementById("logInFormClose").style.display = "none";
  
}
function openlogInForm() {
    document.getElementById("signUpFormOpen").style.display = "none";
    document.getElementById("logInFormClose").style.display = "block";
  
}


localStorage.removeItem("VOTING STAT");
