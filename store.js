////Classes: StockProducts, CartItem, Cart


Swal.fire("Thanks for Visiting!");




class StockProducts {

    static stockArray = [] //to create products
    static categoryNameArray = ["All"] // for category names that will be used for filter
    constructor(singleItemData){
        this.id = singleItemData.id;
        const englishNameEntry = singleItemData.names.find(nameEntry => nameEntry.language.name === "en");  // find specific language entry
          if (englishNameEntry) {
            this.name = englishNameEntry.name;
        } else {
            this.name = singleItemData.name;
        };
        this.description = singleItemData.effect_entries.effect 
        this.price = singleItemData.cost;
        this.category = singleItemData.category.name;
        this.img = singleItemData.sprites.default;
        if (this.price > 0) { // from this point, discard if   price is lower to 0 
            StockProducts.stockArray.push(this);
        } //make conditional  
        if (!StockProducts.categoryNameArray.includes(this.category)) {
            
            StockProducts.categoryNameArray.push(this.category)
        } 
         // push "this" element to the class static property
    }
    // we can create static methods to acces the array, and manipulate its data within the class: for example to search find products and add product discounts.
   
}



// cart class

class  Cart{
    static cartArray = [];

    static removeCartItem(productId) {

        //find the product in array

        const findToRemove = Cart.cartArray.find(item => item.product.id === productId)

        if (findToRemove) {
            if(findToRemove.qty > 1) {
                findToRemove.qty -= 1;
                Swal.fire({
                    title: `¡se redujo la cantidad!`,
                    icon: "success",
                    width: "350px"
                })
            } else {
                const index = Cart.cartArray.indexOf(findToRemove);
                if (index !== -1) {
                    Cart.cartArray.splice(index, 1);
                }
                Swal.fire({
                    title: `¡Su producto  se elimino correctamente!`,
                    icon: "success",
                    width: "350px"
                })
        } 

        //if qty>1 -> decrease qty ; else splice
         }
         localStorage.setItem('cart', JSON.stringify(Cart.cartArray))

         sumTotals()
         displayCart()
         displayPayment()
        
    }
}

// cartitem (product) class



class CartItem {
        constructor(product,qty = 1) {
            this.product = product;
            this.qty = qty;
        }    

        addToCart() {

            const findProductOnCart = Cart.cartArray.find(item => item.product.id === this.product.id);

            if (findProductOnCart) {
                console.log("Product found in cart, updating quantity");
                findProductOnCart.qty += 1;
                localStorage.setItem('cart', JSON.stringify(Cart.cartArray))
            } else {
                console.log("Product not found in cart, adding new item");
                Cart.cartArray.push(this);
                localStorage.setItem('cart', JSON.stringify(Cart.cartArray))
                
            }
            sumTotals()
            displayCart()
            displayPayment();
            Swal.fire({
                title: `¡Su producto  se agrego correctamente!`,
                icon: "success",
                width: "350px"
            })
          
        }
}







let cartTotalPrice = 0
function sumTotals() { //instead of substracting or removing from the sumTotals, we recalculate. wich is more accurate... could be ineficient for shopping carts with too many items
   
    cartTotalPrice = 0

    Cart.cartArray.forEach(product=> {
        let subTotal = product.product.price * product.qty
        cartTotalPrice += subTotal

    })

    displayTotals()
}

const cartTotalPriceBox = document.getElementById("pricetotal")

function displayTotals() {
    cartTotalPriceBox.innerHTML = "Total: $ "

    const productPriceTotal = document.createElement("p")
        productPriceTotal.innerText = cartTotalPrice
        cartTotalPriceBox.appendChild(productPriceTotal)


}



const stockProductCategories = [
    2, //medicine
    27, // healing
    30, //status cures
    33, // special balls
    34

]



// lets get original product data. 
const receivedProductsCategories = [];
const receivedProducts = []
const stockProducts = []
let localStorageCheckStock; 



async function getProducts() { 

    fetch("https://pokeapi.co/api/v2/item-category/?limit=60")
        .then(response1 =>  response1.json())
        .then(serverData1 =>  {
            const fetchPromises = serverData1.results.map(itemcat => {
                return fetch(itemcat.url) 
                            .then(response2 => response2.json())
                            .then(singleCategoryData => { // this can also be evaluatyed using includes and compare if the stock categories include any of the received results.              
                                for (let i = 0; i < stockProductCategories.length; i++) { // iterate over each category ID number in stockProductCategories
                                    if(singleCategoryData.id == stockProductCategories[i]) { // if theres a match on eachitem.id and stockProductCategories elements,
                                        receivedProductsCategories.push(singleCategoryData) // push the matching category to array.
                                        console.log('category pushed');
                                    }  
                                }
                            })
                            .catch( error => {
                                console.log('Error fetching single item category' + error);
                            });
                }); 
        return Promise.all(fetchPromises)  }) //for .then(serverdata1)
         
        .then( () => {
                console.log(receivedProductsCategories)
                receivedProductsCategories.forEach(category => {
                    receivedProducts.push(...category.items)
                   
                })

              //  console.log(receivedProducts) // list of all
                return receivedProducts 
               })
        .then((receivedProducts) => {
            const fetchItemPromises = receivedProducts.map(product => {
                return fetch(product.url)
                        .then(response3 => response3.json())
                        .then(singleItemData => {
                           console.log(singleItemData)
                            new StockProducts(singleItemData)
                            
                        } )
                        .catch(error => console.log("there was an error: " + error))

            })
            return Promise.all(fetchItemPromises)
        }) 
        .then( () => { console.log(StockProducts.stockArray)     } )
        .catch(error => {
            console.log("error: " + error)
            })
    
        .finally(() => {
            console.log("finished fetch operations")
            localStorage.setItem('stock', JSON.stringify(StockProducts.stockArray));  //set stock to local storage
            localStorage.setItem('cat', JSON.stringify(StockProducts.categoryNameArray)) //setCsategories ASrray to local Storage
            localStorageCheckStock = localStorage.getItem("stock") !== null
            console.log(localStorageCheckStock)
            displayStock()
            categoryCards()

        }) // run final tasks 
}






const productListComponent = document.getElementById("storeProductList")

function displayStock(productstoDisplay = StockProducts.stockArray){ //parameter with default vaule
    productListComponent.innerHTML = ''
    productstoDisplay.forEach((product) => {

        const productBox = document.createElement("div");
            productBox.id = product.publicID;
            productBox.className = "productBox";

            const productIMG = document.createElement("div");
            productIMG.innerHTML = `<img src=${product.img}>`
            productBox.appendChild(productIMG)

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
                const cartItem = new CartItem(product);
                cartItem.addToCart();
           
                console.log(Cart.cartArray)
            })
            productListComponent.appendChild(productBox)
    })
}

function displayCart() {

    const cartList = document.getElementById("cartProductList")
    cartList.innerHTML = ''; //reset cart every time it runs

    Cart.cartArray.forEach(cartitem => { 

        const cartItemRow = document.createElement("div");
        cartItemRow.innerHTML = `
            
                                    <div class="cartItem">
                            <p class="producTitle">${cartitem.product.name}</p>
                            <div class="cartProductdDetails">
                                <div class="price detail-children">
                                    <p>${cartitem.product.price}</p>
                                </div>
    
                                <div class="quantity detail-children">
                                    <p>${cartitem.qty}</p>
                                </div>
    
                                 <div class="subtotal detail-children">
                                    <p>Subtotal: ${cartitem.product.price * cartitem.qty}</p>
                                 </div>
                                <div class="remove detail-children">
                                    <button class="remove-btn">Remove</button>
                                </div>
                            </div>
                        </div>

            `;

            // remove from cart

            const removeButton = cartItemRow.querySelector(".remove-btn")
            removeButton.addEventListener("click", () => {
                Cart.removeCartItem(cartitem.product.id);
                displayCart()
            })

            cartList.appendChild(cartItemRow)

    })

}

// create category cards

function categoryCards() {
    const categoriesComponent = document.getElementById("productCategorySelection")

    StockProducts.categoryNameArray.forEach((category, index) => {
        const catCard = document.createElement("div");
        catCard.id = category
        catCard.className = "categoryBox"
        catCard.innerHTML = ` 
        <p>${category}</p>
        `
         // Set "All" as the default active category
         if (index === 0) {
            catCard.classList.add("active");
        }

        catCard.addEventListener('click', () => {
            document.querySelectorAll('.categoryBox').forEach(box => box.classList.remove('active'));

            // Add active class to the clicked category box
            catCard.classList.add('active');
            
            displayCategory(category)

                 // Remove active class from all category boxes
           
             // Add active class to the clicked category box
             catCard.classList.add('active');

        })
        categoriesComponent.appendChild(catCard)


    })
}


function displayCategory(category) {

    let selectedCategory;
    if (category === "All") {
        selectedCategory = StockProducts.stockArray;
        document.getElementById("categoryNames").innerText = "All Categories";
        
        
    } else {

        selectedCategory = StockProducts.stockArray.filter( product => product.category === category);
        document.getElementById("categoryNames").innerText = category;
    }

    displayStock(selectedCategory);

}




/////Payments 

const cartPaymentButton = document.getElementById("paymentButton")
const cartClearButton = document.getElementById("clearButton")


function displayPayment() {
    cartPaymentButton.innerHTML = "";
    cartClearButton.innerHTML = "";
   if (Cart.cartArray.length > 0) {
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

    Cart.cartArray = []
    cartTotalPrice = 0;
    cartTotalProducts = 0;
    paymentForm.innerHTML = "";

    localStorage.removeItem("cart"); // Remove only the cart data from local storage
    displayCart();
    sumTotals();
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
        creditCardInput.maxLength = 19; // Allows space for dashes
        creditCardInput.addEventListener('input', formatCardNumber);

        // Create the CVV input and label
        const cvvLabel = document.createElement("label");
        cvvLabel.innerText = "CVV";
        const cvvInput = document.createElement("input");
        cvvInput.type = "text";
        cvvInput.name = "cvv";
        cvvInput.id = "cvv";
        cvvInput.maxLength = 3;
        cvvInput.addEventListener('input', validateCVV);

        // Create the name input and label
        const nameLabel = document.createElement("label");
        nameLabel.innerText = "Name";
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.name = "name";
        nameInput.id = "name";
        nameInput.addEventListener('input', validateName);


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

function formatCardNumber(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove all non-digit characters
    if (value.length > 16) {
        value = value.slice(0, 16); // Limit to 16 digits
    }
    // Insert dashes
    input.value = value.replace(/(\d{4})(?=\d)/g, '$1-');
}

function validateCVV(event) {
    const input = event.target;
    const value = input.value;
    const cvvPattern = /^\d{3}$/; // Regex pattern for exactly 3 digits
    if (!cvvPattern.test(value)) {
        input.setCustomValidity("CVV must be 3 digits.");
    } else {
        input.setCustomValidity(""); // Clears the error
    }
}

function validateName(event) {
    const input = event.target;
    const value = input.value.trim();
    const namePattern = /^[A-Za-z]+\s[A-Za-z]+$/; // Regex for at least two words
    if (!namePattern.test(value)) {
        input.setCustomValidity("Name must contain at least two words.");
    } else {
        input.setCustomValidity(""); // Clears the error
    }
}

function validateForm(event) {
    event.preventDefault(); // Prevent the default form submission

    const creditCardInput = document.getElementById("creditCard");
    const cvvInput = document.getElementById("cvv");
    const nameInput = document.getElementById("name");

    const creditCardValue = creditCardInput.value.replace(/\D/g, ''); // Remove dashes
    const cvvValue = cvvInput.value;
    const nameValue = nameInput.value.trim();

    if (creditCardValue.length !== 16) {
        alert("Credit Card number must be 16 digits.");
        return;
    }

    if (!/^\d{3}$/.test(cvvValue)) {
        alert("CVV must be 3 digits.");
        return;
    }

    if (!/^[A-Za-z]+\s[A-Za-z]+$/.test(nameValue)) {
        alert("Name must contain at least two words.");
        return;
    }

    // Proceed with payment processing if all validations pass
    payment();
}

function payment() {
    Swal.fire({
        title: `¡Gracias por su pedido!
        Llegara en los proximos dias`,
        icon: "success",
        width: "350px"
    })
    clearCart();
    cartPanel.classList.toggle("active")
    overlay.classList.toggle("active")
}

if (Cart.cartArray.length > 0) {

    displayPayment()
     
 }


///DOM manipulation


const cartIcon = document.getElementById("cartIcon")
const closeCartIcon = document.getElementById("closeCartIcon")

const overlay = document.getElementById("overlay")
const cartPanel = document.getElementById("cartPanel")

cartIcon.addEventListener("click", () => {

    overlay.classList.toggle("active")
    cartPanel.classList.toggle("active")
})

closeCartIcon.addEventListener("click", () => {
    cartPanel.classList.toggle("active")          
    overlay.classList.toggle("active")
    
})







function initializeCartFromLocalStorage() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        Cart.cartArray = JSON.parse(storedCart);  // Correctly assigning the parsed cart array to Cart.cartArray
        sumTotals();
        displayCart();
        
        if (Cart.cartArray.length > 0) {  
            displayPayment();
        }
    }  
}


if (localStorage.getItem("stock") === null) {
    getProducts();  
    console.log("from fetch")
} else {
    const storedStock = JSON.parse(localStorage.getItem("stock"));
    const storedCats = JSON.parse(localStorage.getItem("cat"));
    console.log(" stockfrom storage")
    console.log("cats from storage")
    StockProducts.stockArray = storedStock;
    StockProducts.categoryNameArray = storedCats;

    console.log(StockProducts.stockArray + "fromstorage")
    displayStock(); // Display the stock fetched from local storage
    categoryCards(); // Initialize categories from the stored stock
}

// Ensure the cart is initialized from local storage
initializeCartFromLocalStorage()