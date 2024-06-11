// User Log In Notification

const userAgreementAnswer =  () => {

let userNotification = confirm("To see our products you have to log in") // Ask user for log in 

if (userNotification) { 
    console.log("User Agreed to log in") // log user action if confirm == true
} else { //user decides to not log in
    console.log("user declined login")
    alert("Log in canceled, please refresh the page.")
}

return userNotification
}

let userloginconscent = userAgreementAnswer()
console.log( "user selected " + userloginconscent)

/////  User Log in  Process

let logInCounter = 3;  // user has three attempts to log in


const userName = prompt("Username:"); // global scope so we could reuse later
const password = prompt("Paswrod: "); // global scope


function logIn (username, password) {

    if (username == "Client1" && password == "pass1234") {

        alert("Welcome " + username);
        return true

    } else {
        alert("Log in credentials are wrong");
        console.log("failed.log in")
        return true

    }


}

logIn(userName,password)



/* do {
    let userName  = user;
    let pass = prompt(Password)
} while (condition); */