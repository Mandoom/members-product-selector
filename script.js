// User Log In Notification

const userAgreementAnswer =  () => {

let userNotification = confirm("To see our products you have to log in") // Ask user for log in 

if (userNotification) { 
    console.log("User Agreed to log in") // log user action if confirm == true
} else { //user decides to not log in
    console.log("user declined login") //log user action if confirm == false
    alert("Log in canceled, please refresh the page.")
}

return userNotification
}

let userLogInConscent = userAgreementAnswer()
console.log( "user selected " + userLogInConscent)



/////  User Log in  Process

let logInCounter = 3;  // user has three attempts to log in



do {

    const userName = prompt("Username:"); 
    const password = prompt("Paswrod: "); 

    if (userName == "Client 1" && password == "pass1234") {

        alert("Bienvenido " + userName)
        console.log("User loged in successfull")
        break
        
    } else {

        logInCounter--
        alert("log in failed " + logInCounter + " attempts left")
      
    }
    
} while (logInCounter >= 0 );


/* function logIn (username, password) {

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
 */


