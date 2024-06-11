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
let loggedIn = false

let logInCounter = 3;  // user has three attempts to log in

if (userLogInConscent === true) {
    logInPrompt()
}

function logInPrompt () {
    do { //repeat while user has "logInCounter" attempts >= 0

        const userName = prompt("Username:"); 
        const password = prompt("Paswrod: "); 
    
        if (userName == "Client 1" && password == "pass1234") {
    
            alert("Welcome to our store " + userName)
            console.log("User loged in successfull")
            loggedIn = true;
            break // if log in successfull break the loop
            
            
        } else {
    
            --logInCounter //decrease login attempts counter
            alert("log in failed " + logInCounter + " attempts left")
          
        }
        
    } while (logInCounter > 0 );

}



   


// online store sim 


const productsList = ["Product1", "Product2", "Product3"]; //existing products
const priceList = [10, 5, 25]; //price for existing products 
const selectedProductsList = []; //order products
let totalPrice = 0; //order total price

////Messages

// Store message

const showAvailableProductsList = () => {
  //arrow function create a message for the options available

  let messageProductList = " These are the available products: \n"; //create a message
  for (let i = 0; i < productsList.length; i++) {
    // adds the products + a new line looping trough the list of products and prices with the same index number
    messageProductList +=   "-  " + productsList[i] + " - price :$" + priceList[i] + "\n";
  }
  return (messageProductList +=
    "Plese input the number asociated with the product you wish to add product: "); //return the message list where invoked
};

// Cart Message


const showCartProductsList = () => {
  //arrow function create a message for the products in the cart

  let messageCartList = " These are the products in your cart: \n "; //create a message to display the items in the cart

  for (let i = 0; i < selectedProductsList.length; i++) {
    // adds the products + a new line looping trough the list of products
    messageCartList += selectedProductsList[i] + "\n";
  }
  return messageCartList;
};



// function to add products
function addProduct() {
  let newProductSelection = Number(prompt(showAvailableProductsList()));
  //console.log(newProductSelection)
  let selectedProductIndex = --newProductSelection; // match selection to product index [0] = p1 ...
  //console.log(selectedProductIndex)
  //alert("the selected product is" + productsList[selectedProductIndex])
  selectedProductsList.push(productsList[selectedProductIndex]); //add the selected product with the matched index to the array
  console.log("new product added to cart");
  let productAdded = productsList[selectedProductIndex];
  alert(productAdded + ": was added susccefully to your cart"); // alert user of added product
  let productPrice = priceList[selectedProductIndex]; //create product price var for the selected product
  totalPrice += productPrice; //sum the price of selected product 
}

//addFirstProduct()

// Add price



//   Delete  product from List
//   show porducts on the list with pseudoindex
//   prompt for number
//   equal pseudoindex to actual array index
//   pass pseudoindex equaled to splice as start position

function deleteProduct(productDeletion) {
  let selectedProductD = productDeletion;
  let deleteProductIndex = --selectedProductD;
  let deletedProducts = selectedProductsList.splice(deleteProductIndex, 1);
  alert("The product: " + deletedProducts[0] + " was deleted from the cart ");
  let dProductPrice = priceList[deleteProductIndex]; //create product price var for the selected product
  totalPrice -= productPrice; // //substract the price of selected product
}
//deleteProduct(prompt(showCartProductsList()))


let shopControl = true; // flag for store loop


    function store() {
        let storeSelection;
       
        do {
          storeSelection = prompt("To add products to your cart use '+' \nTo remove products from your car use '-' \nTo see your cart use '/' \n Use '-1' to cancel" ); // action for this iteration
      
          if (storeSelection === null) { //if user cancels or hits esc
              alert("Input canceled. Exiting the store.");
              break;
          }
      
          switch (storeSelection) {
            case "+": // to add products
              addProduct();
              break;
      
            case "-": // to delete products
              alert("que producto quieres remover");
              deleteProduct(prompt( showCartProductsList() + " Enter the number of the product you wish to remove"));
              break;
      
            case "/": // go to cart
              paymentControls()
              break;
      
              case "-1":
                  alert("canceled. please visit us again later")
                  shopControl = false;
              break;
      
              
      
            default:
              alert("incorrect input, please try again ")
          }
        } while (shopControl == true);
      }
      
if (loggedIn === true) {
    store();
} else {
    
}




//let addMoreProducts = confirm("add more products (Yes = confirm) No = (Cancel)")

function paymentControls() {

    let cartConfirmation = confirm("proceed to payment \n" + showCartProductsList() + "\nTotal: $" + totalPrice + "\n hit cancel to go back to the store");


    if (cartConfirmation) {

            if( selectedProductsList.length < 1) {
                alert("Please add products before continuing");
        
            }   else if ( (selectedProductsList.length > 0 && selectedProductsList.length < 4) ) {
                alert("You'll receive order summary and confirmation in your email with instructions for payment")
                shopControl = false;
        
            }  else if (selectedProductsList.length >= 4  ) {
        
            alert("you selected " + selectedProductsList.length + " products. you get a discvount from 10%")
            let discountPrice =  totalPrice - (totalPrice * 0.1)
            alert("your new total is: $" + discountPrice)
            alert(    "You'll receive order summary and confirmation in your email with instructions for payment"  );      
            shopControl = false;
        
        
            } 

    } else {
        alert("Going back to the store");
    }

}
