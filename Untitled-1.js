// class for creating product object. this class includes a static "array" property for simplified management of created products. this is used for receiving products from the server and to create products as an admin 



const stockProductCategories = [
    2, //medicine
    27, // healing
    30, //status cures
    33, // special balls
    34, // standard-balls
    39, //appricorn balls


]

// lets get original product data. 
let receivedProductsCategories = [];
const receivedProducts = []
const stockProducts = []


async function getCategories() {



    fetch("https://pokeapi.co/api/v2/item-category/?limit=60")
        .then(response1 =>  response1.json())
        .then(serverData1 =>  {
            const fetchPromises = serverData1.results.map(itemcat => {
                return fetch(itemcat.url) //for fetchpromises
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
        return Promise.all(fetchPromises)  }) //for .then(serverdata
         
        .then( () => {
                console.log(receivedProductsCategories)
                receivedProductsCategories.forEach(category => {
                    receivedProducts.push(...category.items)
                   
                })
                console.log(receivedProducts) // list of all 
               })
        .then((receivedProducts) => {
            const fetchPromises =



        } ) 
        .then() //set stock to local storage
        .catch(error => {
            console.log("error: " + error)
            })
    
        .finally(() => console.log("finished fetch operations")) // run final tasks 
    
  

}

getCategories()


// stock class

class StockProducts {
    static idSetter = 1;
    static stockArray = []

    constructor(id, productName, productPrice,img){
        this.id = ++StockProducts.idSetter; // create id secuentially        this.productName = productName;
        this.productPrice = productPrice;
        this.img = img;
        StockProducts.stockArray.push(this) // push "this" element to the class static property
    }
    // we can create static methods to acces the array, and manipulate its data within the class: for example to search find products and add product discounts.
   
}
