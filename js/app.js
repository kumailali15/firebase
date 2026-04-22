import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyAULqTsxiVOzJx96qpopF4jv_8gZUe-jEk",
    authDomain: "project-bf193.firebaseapp.com",
    projectId: "project-bf193",
    storageBucket: "project-bf193.firebasestorage.app",
    messagingSenderId: "464355156496",
    appId: "1:464355156496:web:374be564d0ec7cc9692095",
    measurementId: "G-RY1XFJQXS5"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
var text = document.getElementById("text")
    //signup
var signupbtn = document.getElementById("signupbtn")
signupbtn.addEventListener("click", signup)
    //login
var loginbtn = document.getElementById("loginbtn")
loginbtn.addEventListener("click", login)
    //logout
var logoutbtn = document.getElementById("logoutbtn")
logoutbtn.addEventListener("click", logout)
    //Continue With Google
var google = document.getElementById("google")
google.addEventListener("click", ContinueWithGoogle)
    //Phone OTP Verification
var sendbtn = document.getElementById("sendOTPbtn")
sendbtn.addEventListener("click", sendOTP)
    //onAuthStateChanged
onAuthStateChanged(auth, (user) => {
    if (user) {
        text.innerText = user.email

    } else {}
});
//signupFunction
function signup() {
    var semail = document.getElementById("semail").value
    var spassword = document.getElementById("spassword").value

    createUserWithEmailAndPassword(auth, semail, spassword)
        .then((userCredential) => {
            const user = userCredential.user;
            text.innerText = user.email;

            showAlert("Signup successful 🎉", "success");
        })
        .catch((error) => {
            showAlert("Signup failed ❌ " + error.message, "error");
        });
}
//loginFunction
function login() {
    var lemail = document.getElementById("lemail").value
    var lpassword = document.getElementById("lpassword").value

    signInWithEmailAndPassword(auth, lemail, lpassword)
        .then((userCredential) => {
            const user = userCredential.user;
            text.innerText = user.email;
            text.style.color = "green";

            showAlert("Login successful 🔥", "success");
        })
        .catch((error) => {
            text.innerText = error.code;
            text.style.color = "red";

            showAlert("Login failed ❌ " + error.message, "error");
        });
}
//logoutFunction
function logout() {
    signOut(auth)
        .then(() => {
            text.innerText = "";
            showAlert("Logout successful 👋", "success");
        })
        .catch((error) => {
            showAlert("Logout failed ❌ " + error.message, "error");
        });
}
//continue with google
const provider = new GoogleAuthProvider();

function ContinueWithGoogle() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            showAlert("Google login successful 🚀", "success");
            console.log("user", user)
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            showAlert("Google login failed ❌ " + error.message, "error");
        });
}
//Phone OTP Verification
function sendOTP() {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal'
    });

    const phoneNumber = document.getElementById("phoneNum").value;
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;

            showAlert("OTP sent 📩", "success");
        })
        .catch((error) => {
            showAlert("OTP failed ❌ " + error.message, "error");
        });
}
//OTP verify
document.getElementById("OTPverifybtn").addEventListener("click", async() => {
    const code = document.getElementById("OTPverify").value;

    try {
        await window.confirmationResult.confirm(code);
        showAlert("Phone verified ✅", "success");
    } catch (error) {
        showAlert("Invalid OTP ❌", "error");
    }
});
//Firestore Database
//crud (create,read,update,delete)
import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp,
    addDoc,
    collection,
    getDocs,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
const db = getFirestore(app);
console.log("db=", db)
    // CRUD :
    // C = Create (naya data banana)
    // R = Read (data dekhna)
    // U = Update (data change karna)
    // D = Delete (data remove karna)
async function SetData() {
    await setDoc(doc(db, "user", "a"), {
        name: "Los Angeles",
        state: "CA",
        country: "USA",
        // date:new Date() ....  local machine yani apky laptop ka time show kary ga
        time: serverTimestamp() //ya server sai time uthata hai
    });
}
SetData()

async function AddData() {
    var QuoteInput = document.getElementById("QuoteInput")
    var Add = document.getElementById("Addbtn")
    var quotelist = document.getElementById("quotelist")

    QuoteInput.addEventListener("click", QuoteInp)
    Add.addEventListener("click", Addbtn)


    const quotecollection = collection(db, "quotes") //setDoc mai id zaroori hai jab kay 
        // AddDoc mai id zaroori nahi kiu hai wo collection use krta hai hai or iski apni ek id khud ban jati hai.

    function QuoteInp() {}

    async function Addbtn() {
        await addDoc((quotecollection), {
            qoute: QuoteInput.value,
            time: serverTimestamp()
        });

        // ✅ input clear
        QuoteInput.value = "";

        // ✅ fancy alert call
        showAlert("Quote added successfully ✅");

        getQoute();
    } //jaisa setDoc mai Doc ata hai waisa hi AddDoc mai pura Collection ata hai.


    async function getQoute() {
        quotelist.innerHTML = ""
        const querySnapshot = await getDocs(quotecollection);
        querySnapshot.forEach((doc) => { //querysnapshot ka kaam : apka jinta bhi data hai firebase mai 
            // us par for each chala kar apko dai deta hai.
            // forEach ka kaam hu array ya list ke har item pe loop chalana.
            //isky upper forEach hi chly gai or kuch nhi.
            console.log(doc.id, " => ", doc.data().qoute);
            const li = document.createElement("li")
            li.textContent = doc.data().qoute + "  "
            const editbtn = document.createElement("button")
            editbtn.textContent = "Edit"
            editbtn.addEventListener("click", function() {
                Editquote(doc.id, doc.data().qoute)
            })
            const deletebtn = document.createElement("button")
            deletebtn.textContent = "Delete"
            deletebtn.addEventListener("click", function() {
                deleteQuote(doc.id)
            })
            li.appendChild(editbtn)
            li.appendChild(deletebtn)
            quotelist.appendChild(li)

        });
        async function Editquote(id, oldqoute) {
            const newQuote = await prompt("Enter New Quote", oldqoute)
            await updateDoc(doc(db, "quotes", id), {
                qoute: newQuote
            })
        }
    }
    getQoute()
        // Editquote
    async function Editquote(id, oldqoute) {
        const newQuote = await prompt("Enter New Quote", oldqoute)
        await updateDoc(doc(db, "quotes", id), {
            qoute: newQuote
        })
    }
    // deleteQuote
    async function deleteQuote(id) {
        await deleteDoc(doc(db, "quotes", id))
        getQoute()
    }
}

AddData()

function showAlert(message, type = "success") {
    const alertBox = document.getElementById("alertBox");
    alertBox.innerText = message;

    alertBox.className = "alert show " + type;

    setTimeout(() => {
        alertBox.className = "alert";
    }, 3000);
}

showAlert("Login successful 🔥");
showAlert("Login failed ❌");