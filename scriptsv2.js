// Create log in function that has there are admin roles and client roles

//admins can add products to the inventory or delete them
//clients can view the products and add products to the cart


// const users = [] //empty array to push "registered users"


// let logInStatus = false

// //console.log(logInStatus)  

// class Users{ //base for user creation
//     constructor(username,password) {
//         this.username = username
//         this.password = password
       
//     }
// }

// class Roles extends Users { //use to create users with an asigned role
//     constructor(username,password,role) {
//         super(username,password)
//         this.role = role
//     }
// }

// //create users
// const userAdmin = new Roles("administrator", "pass1234", "admin")
// //console.log(userAdmin)
// users.push(userAdmin)
// const userClient = new Roles("clientDemo", "pass1234", "client" )
// console.log(users)

// //// LOGIN



// function checkUserExist(arr, username, password) { // check if the username and password combination is valid
//     console.log(arr.find(el => username == el.username && password == el.password))
//     return arr.find(el => username == el.username && password == el.password)
//     }
// function setUserStorage(userCheck){ // tore the type of login for the session 

//     sessionStorage.setItem("loggedin", JSON.stringify(true))
//     sessionStorage.setItem("role", JSON.stringify(userCheck.role))
// }

// let logInCounter = 3
// function loginCredentials(){
//     do {
//         let userName = prompt("username:")
//         let passwordIN = prompt("password")
//         const userCheck = checkUserExist(users, userName, passwordIN) // call for function that finds the user with matching username and pass / since usernames should be unique....
//         let userexist = userCheck !== undefined // compares user against undefined and if exists return true

//         if (userexist) {
//             console.log("correct login details")
//             logInStatus = true; // sets login to true
//             alert("Welcome " + userCheck.username)
//             setUserStorage(userCheck)
//             break    
//         } else {
//             --logInCounter
//             console.log("failed attempt")
//         }
  
//     } while (logInCounter > 0);
// }

// loginCredentials()



////// STORE

let stock = []
let cart = []




function initializeCartFromLocalStorage() {
    const storedCart = localStorage.getItem("cart")
    if (storedCart){
        cart = JSON.parse(storedCart)
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
        this.price = this.price - ( this.price * 0.1) 
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
const productListComponent = document.getElementById("storeProductsList")
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



    console.log(productListComponent)
    return productListComponent;
} 

////// add to cart

function addToCart(productID) {

    let productFound = false ;
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
            console.log(cart);

            localStorage.setItem("cart", JSON.stringify(cart));
        }

    })
    displayCart()



}





////// CART

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

        // const productButton = document.createElement("button");
        // productButton.innerText = "remove from cart" ;
        // productBox.appendChild(productButton) // append element to respective parent

        // productButton.addEventListener("click" , () => {
        //     addToCart(product.id)
        // })


        cartListComponent.appendChild(productBox) //apend product box to product list 

    })
}



initializeCartFromLocalStorage();
displayStock();
displayCart();