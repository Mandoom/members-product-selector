/* // User Log In Notification

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



do { //repeat while user has "logInCounter" attempts >= 0

    const userName = prompt("Username:"); 
    const password = prompt("Paswrod: "); 

    if (userName == "Client 1" && password == "pass1234") {

        alert("Welcome to our store " + userName)
        console.log("User loged in successfull")
        break // if log in successfull break the loop
        
    } else {

        logInCounter-- //decrease login attempts counter
        alert("log in failed " + logInCounter + " attempts left")
      
    }
    
} while (logInCounter >= 0 ); */


// Show user the product list with prices



const productsList = ["Product1", "Product2", "Product3"]
const priceList = [10, 5, 25]
const selectedProductsList = ["p1", "p2"]

let totalPrice = 0;


// Store

const showAvailableProductsList = () => { //arrow function create a message for the options available

    let messageProductList = " These are the available products: \n"; //create a message
    for (let i = 0; i < productsList.length; i++) { // adds the products + a new line looping trough the list of products 
        messageProductList += productsList[i] + "\n"
      }
      return messageProductList += "Plese input the number asociated with the product you wish to add product: "  //return the message list where invoked

}

// Cart

const showCartProductsList = () => { //arrow function create a message for the products in the cart

    let messageCartList = " These are the products in your cart: \n "; //create a message to display the items in the cart

    for (let i = 0; i < selectedProductsList.length; i++) { // adds the products + a new line looping trough the list of products 
        messageCartList += selectedProductsList[i] + "\n"
      }
     return messageCartList
}









/* 
function showProducts() {

    const showProductList = " These are the available products: \n"; //base for allert message
    
    for (let i = 0; i < productList.length; i++) { // adds the products + a new line looping trough the list of products 
        showProductList += productList[i]

      }

    prompt(showProductList)



    do {
  

        

        prompt("Select Your Products")
        
    } while (condition);

}

const selectedProducts = [] // global so function can access and push arrayt elements to it with scope functions and to make accesible the array to other functions
 */

