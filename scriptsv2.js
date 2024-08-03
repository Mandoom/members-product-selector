// Create log in function that has there are admin roles and client roles

// admins can add products to the inventory or delete them
// clients can view the products and add products to the cart


const users = [] //empty array to push "registered users"
let logInStatus = false

//console.log(logInStatus)  

class Users{ //base for user creation
    constructor(username,password) {
        this.username = username
        this.password = password
       
    }
}

class Roles extends Users { //use to create users with an asigned role
    constructor(username,password,role) {
        super(username,password)
        this.role = role
    }
}

//create users
const userAdmin = new Roles("administrator", "pass1234", "admin")
//console.log(userAdmin)
users.push(userAdmin)
const userClient = new Roles("clientDemo", "pass1234", "client" )
users.push(userClient)
console.log(users)

//// LOGIN



function checkUserExist(arr, username, password) { // check if the username and password combination is valid
    console.log(arr.find(el => username == el.username && password == el.password))
    return arr.find(el => username == el.username && password == el.password)
    }
function setUserStorage(userCheck){ // tore the type of login for the session 

    localStorage.setItem("loggedin", JSON.stringify(true))
    localStorage.setItem("role", JSON.stringify(userCheck.role))
}

let logInCounter = 3
function loginCredentials(){
    do {
        let userName = prompt("username:")
        let passwordIN = prompt("password")
        const userCheck = checkUserExist(users, userName, passwordIN) // call for function that finds the user with matching username and pass / since usernames should be unique....
        let userexist = userCheck !== undefined // compares user against undefined and if exists return true

        if (userexist) {
            console.log("correct login details")
            logInStatus = true; // sets login to true
            alert("Welcome " + userCheck.username)
            setUserStorage(userCheck)
            break    
        } else {
            --logInCounter
            console.log("failed attempt")
        }
  
    } while (logInCounter > 0);
}

function checkForStoredUser() {
    const loggedIn = JSON.parse(localStorage.getItem("loggedin"));
    
    const role = JSON.parse(localStorage.getItem("role"));
    if (!loggedIn || !role) {
        loginCredentials();
    } else {
        console.log("User already logged in as " + role);
    }
    console.log(loggedIn)
}


checkForStoredUser();



////// STORE

let stock = []
let cart = []




function initializeCartFromLocalStorage() {
    const storedCart = localStorage.getItem("cart")
    if (storedCart){
        Cart.cartArray = JSON.parse(storedCart)
        sumTotals()

        if (cart.length > 0) {
            displayPayment();
        }
    };
}


class Product { //create products with class
    
    static  idSetter = 0 // static property to increment on eqach instance and use a value for ID 
    static productsArray = [] // to manage the products array as part of the class 

    constructor(name,price) {
        this.id = ++Product.idSetter; // set the public id property from the setter
        this.name = name;
        this.price = price;
        Product.productsArray.push(this) // self reference usage within a class
    }
    productDiscount() {
        this.price = this.price - (this.price * 0.1) 
    }
}


const product1 = new Product("Keyboard", 20)
const product2 = new Product("Mouse", 15)
const product3 = new Product("Monitor", 150)
const product4 = new Product("Processor", 200)
const product5 = new Product("GPU", 20)
//console.log(Product.productsArray) 

stock = Product.productsArray // set stock from products array
console.log(stock)

    
// to add products if logged in as admin 


///////// DISPLAY STOCK
const productListComponent = document.getElementById("storeProductList")

function displayStock(){
    stock.forEach((product) => { // CRETAE HTMNL STRUCTURE FOR EACH ELEMENT OF THE "STOCK ARRAY"

            const productBox = document.createElement("div");
            productBox.id = product.id;
            productBox.className = "productBox";

            const productTitle = document.createElement("h3");
            productTitle.innerText = product.name;
            productBox.appendChild(productTitle) // append element to respective parent

            const productPrice = document.createElement("p");
            productPrice.innerText = "Price:" + product.price;
            productBox.appendChild(productPrice) // append element to respective parent

            const productButton = document.createElement("button");
            productButton.innerText = "add to cart" ;
            productBox.appendChild(productButton) // append element to respective parent

            productButton.addEventListener("click" , () => {
                addToCart(product.id)
            })

            console.log(productBox);

            productListComponent.appendChild(productBox) //apend product box to product list 

    })

} 

////// add to cart

function addToCart(productID) {


    let selectedProduct;
    stock.forEach(product => {
        if ( product.id == productID ){
            selectedProduct = { // define selected product as object literal with respective properties in the cart array
                id: product.id,
                name: product.name,
                price: product.price,
            };
           // console.log(selectedProduct);
            cart.push(selectedProduct);
            sumCartTotals(selectedProduct)
            console.log(cartTotalProducts)
            console.log(cart);

            localStorage.setItem("cart", JSON.stringify(cart)); // set localstorage for cart
        }

    })
    displayCart()
    displayCartTotals()
    displayPayment();

}


function removeFromCart(productID) {

    const index = cart.findIndex(product => product.id === productID);
    if (index !== -1) {
        const productToRemove = cart[index];
        substractCartTotal(productToRemove);
        cart.splice(index, 1); // Remove the product at the found index
    }

    // Update the cart in local storage and refresh the display
    if (cart.length < 1) {
        paymentForm.innerHTML = "";
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(cart) // set localstorage for cart
    displayCart();
    displayCartTotals()
    displayPayment();
    
}




////// CART PRODUCT LIST

const cartListComponent = document.getElementById("cartProductList")

function displayCart() {
    //replicating logic for display in the cart 
    cartListComponent.innerHTML = ""; // reset state of the cart

    cart.forEach((product) => { // CRETAE HTMNL STRUCTURE FOR EACH ELEMENT OF THE "STOCK ARRAY"

        const productBox = document.createElement("div");
        productBox.id = product.id;
        productBox.className = "cartProductBox";

        const productTitle = document.createElement("h3");
        productTitle.innerText = product.name;
        productBox.appendChild(productTitle) // append element to respective parent

        const productPrice = document.createElement("p");
        productPrice.innerText = "Price:" + product.price;
        productBox.appendChild(productPrice) // append element to respective parent

        const productButton = document.createElement("button");
        productButton.innerText = "remove from cart" ;
        productBox.appendChild(productButton) // append element to respective parent

        productButton.addEventListener("click" , () => {
            removeFromCart(product.id)
        })


        cartListComponent.appendChild(productBox)
       //apend product box to product list 

    })
}

//cartTotals
let cartTotalPrice = 0
let cartTotalProducts = 0

function sumCartTotals(selectedProduct) {
    cartTotalPrice += selectedProduct.price
    console.log(cartTotalPrice)
    ++cartTotalProducts
}

function substractCartTotal(product) {

    cartTotalPrice -= product.price
    console.log(cartTotalPrice)
    --cartTotalProducts


}

// display cart totals
const cartTotalPriceBox = document.getElementById("pricetotal")
const cartTotalItemssBox = document.getElementById("itemstotal")


function displayCartTotals() {

    cartTotalPriceBox.innerHTML = "";
    cartTotalItemssBox.innerHTML = "";

    

    // price box

        const productPriceTag = document.createElement("h3")
        productPriceTag.innerText = "Your Total is:" ;
        cartTotalPriceBox.appendChild(productPriceTag)

        const productPriceTotal = document.createElement("p")
        productPriceTotal.innerText = cartTotalPrice
        cartTotalPriceBox.appendChild(productPriceTotal)

// total of items
        const productItemsTag = document.createElement("h3")
        productItemsTag.innerText = "Number of items:" ;
        cartTotalItemssBox.appendChild(productItemsTag)
        

        const productItemTotal = document.createElement("p")
        productItemTotal.innerText = cartTotalProducts
        cartTotalItemssBox.appendChild(productItemTotal)
       
}

// Trigger and "process payment"



const cartPaymentButton = document.getElementById("paymentButton")
const cartClearButton = document.getElementById("clearButton")


function displayPayment() {
    cartPaymentButton.innerHTML = "";
    cartClearButton.innerHTML = "";
   if (cart.length > 0) {
    cartPaymentButton.innerHTML = ""
    cartClearButton.innerHTML = "" 

   const payButton = document.createElement("button")
   payButton.innerText = "pay now"
   payButton.addEventListener("click", processPaymentForm);
   cartPaymentButton.appendChild(payButton)

   const clearCartButton = document.createElement("button")
   clearCartButton.innerText = "empty cart";
   clearCartButton.addEventListener("click", clearCart);
   cartClearButton.appendChild(clearCartButton)
   console.log("it ran")
   }

}

function clearCart() {

    cart = []
    cartTotalPrice = 0;
    cartTotalProducts = 0;
    paymentForm.innerHTML = "";

    localStorage.removeItem("cart"); // Remove only the cart data from local storage
    displayCart();
    displayCartTotals();
    displayPayment(); 
}


function processPaymentForm() {
    const paymentForm = document.getElementById("paymentForm");
    paymentForm.innerHTML = "";

        // Create the credit card input and label
        const creditCardLabel = document.createElement("label");
        creditCardLabel.innerText = "Credit Card";
        const creditCardInput = document.createElement("input");
        creditCardInput.type = "text";
        creditCardInput.name = "creditCard";
        creditCardInput.id = "creditCard";

        // Create the CVV input and label
        const cvvLabel = document.createElement("label");
        cvvLabel.innerText = "CVV";
        const cvvInput = document.createElement("input");
        cvvInput.type = "text";
        cvvInput.name = "cvv";
        cvvInput.id = "cvv";

        // Create the name input and label
        const nameLabel = document.createElement("label");
        nameLabel.innerText = "Name";
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.name = "name";
        nameInput.id = "name";

        // Create the submit button
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.addEventListener("click", payment);
        submitButton.innerText = "Submit";

        // Append the elements to the paymentForm
        paymentForm.appendChild(creditCardLabel);
        paymentForm.appendChild(creditCardInput);
        paymentForm.appendChild(document.createElement("br"));

        paymentForm.appendChild(cvvLabel);
        paymentForm.appendChild(cvvInput);
        paymentForm.appendChild(document.createElement("br"));

        paymentForm.appendChild(nameLabel);
        paymentForm.appendChild(nameInput);
        paymentForm.appendChild(document.createElement("br"));

        paymentForm.appendChild(submitButton);

}

function payment () {

    clearCart()
    alert("thanks for your purchase")
}

if (cart.length > 0) {

    displayPayment()
     
 }
// event listener for "payment submit"

// function payments() { //triggers on form submit
//     alert("your payment has been processses")
//     localStorage.clear()

// }




displayStock();
displayCart();
displayCartTotals();