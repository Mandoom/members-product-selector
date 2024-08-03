// class for creating product object. this class includes a static "array" property for simplified management of created products. this is used for receiving products from the server and to create products as an admin 
// stock class

class StockProducts {

    static stockArray = [] //to create products
    static categoryNameArray = ["all"] // for category names that will be used for filter

    constructor(singleItemData){
        this.id = singleItemData.id;
        // find specific language entry
        const englishNameEntry = singleItemData.names.find(nameEntry => nameEntry.language.name === "en");
          if (englishNameEntry) {
            this.name = englishNameEntry.name;
        } else {
            this.name = singleItemData.name;
        };

        this.price = singleItemData.cost;
        this.category = singleItemData.category.name;
        this.img = singleItemData.sprites.default;
        StockProducts.stockArray.push(this);
        if (!StockProducts.categoryNameArray.includes(this.category)) {
            
            StockProducts.categoryNameArray.unshift(this.category)
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
            } else {
                const index = Cart.cartArray.indexOf(findToRemove);
                if (index !== -1) {
                    Cart.cartArray.splice(index, 1);
                }
        } 

        //if qty>1 -> decrease qty ; else splice
         }

    }
}

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
            displayCart()
        }
}
// class Cart extends StockProducts { // should avoid extending stock to carts as it implies a 1 on 1 relationship()

//     static cartArray = [];

//     constructor(singleItemData, qty) {
//     super(singleItemData);
//     this.qty = 1;
//     }

//     addToCart() {
//         console.log("Cart Array:", Cart.cartArray);  // Log the current state of the cartArray
//         console.log("Current Product ID:", this.id); // Log the ID of the product being added
        
//         const findProductOnCart = Cart.cartArray.find(product => product.id === this.id);
        
//         if (findProductOnCart) {
//             console.log("Product found in cart, updating quantity");
//             findProductOnCart.qty += 1;
//         } else {
//             console.log("Product not found in cart, adding new item");
//             Cart.cartArray.push(this);
//         }
//     }

// }


const stockProductCategories = [
    2, //medicine
    27, // healing
    30, //status cures
    33, // special balls
    34, // standard-balls
    39, //appricorn balls


]



// lets get original product data. 
const receivedProductsCategories = [];
const receivedProducts = []
const stockProducts = []
let localStorageCheckStock; 


//asyncronous operations

fetch

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
                           //console.log(singleItemData)
                            new StockProducts(singleItemData)
                            
                        } )
                        .catch(error => console.log("there was an error: " + error))

            })
            return Promise.all(fetchItemPromises)
        }) 
        .then( () => { console.log(StockProducts.stockArray)     } ) //set stock to local storage
        .catch(error => {
            console.log("error: " + error)
            })
    
        .finally(() => {
            console.log("finished fetch operations")
            localStorage.setItem('stock', JSON.stringify(StockProducts.stockArray));
            localStorageCheckStock = localStorage.getItem("stock") !== null
            console.log(localStorageCheckStock)
            displayStock()

        }) // run final tasks 
}
getProducts()


const productListComponent = document.getElementById("storeProductList")

function displayStock(){
    StockProducts.stockArray.forEach((product) => {

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


///DOM manipulation SLide in Cart


const cartIcon = document.getElementById("cartIcon")
const closeCartIcon = document.getElementById("closeCartIcon")

const overlay = document.getElementById("overlay")
const cartPanel = document.getElementById("cartPanel")

cartIcon.addEventListener("click", () => {

    overlay.classList.toggle("active")
    cartPanel.classList.toggle("active")
})

closeCartIcon.addEventListener("click", () => {

    overlay.classList.toggle("active")
    cartPanel.classList.toggle("active")
})







