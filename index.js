// <-- write code here -->
let currentPizza;
let cartItemsMap = {}; // Map to track the quantity of each item in the cart

// Left hand side list of pizza pictures
const pizzaList = document.getElementById("pizza-list")
// Detail elements in center of page
const currentPizzaImage = document.getElementById("detail-image")
const detailName = document.getElementById("detail-name")
const toppingsList = document.getElementById("toppings-list")
const shownComment = document.getElementById("comments-shown")
const ratingShown = document.getElementById("rating-shown")
const addToCartButton = document.getElementById("add-to-cart")
const removeButton = document.getElementById("remove");
// Cart elements
const cartList = document.getElementById("cart-list")
const clearCartButton = document.getElementById("clear-cart")
const placeOrderButton = document.querySelector("#place-order")
const cartItems = document.getElementById("cart-area").querySelector("ul");
const totalElement = document.getElementById("total");
// Modal elements
const popupModal = document.getElementById("popup-modal")
const closeModalButton = document.querySelector(".close")
// Filter elements
const pizzaClassic = document.getElementsByClassName("classic")
const pizzaPopular = document.getElementsByClassName("popular")
const pizzaNew = document.getElementsByClassName("new-pizza")



fetch("http://localhost:3000/pizzas")
.then(resp => resp.json())
.then(data =>{
    data.forEach(pizza => addPizzaToList(pizza))
    addPizzaToCart();
    showMenu()
    clearCart();
})

function addPizzaToList(pizza){
    const img = document.createElement("img")
    img.src = pizza.image
    pizzaList.append(img)

    //event listener will show the selected pizza's details in the central detail section of the screen
    img.addEventListener("click", () => {
        toppingsList.innerHTML = "";
        currentPizza = pizza;
        currentPizzaImage.src = currentPizza.image;
        detailName.textContent = currentPizza.name;
        (currentPizza.ingredients).forEach((ingredient) => {
            const liElement = document.createElement("li")
            liElement.textContent = ingredient;
            toppingsList.append(liElement);
        })
        shownComment.textContent = currentPizza.comment; // display the comment
        ratingShown.textContent = currentPizza.rating; // display the rating
    });
}

function addPizzaToCart() {
    addToCartButton.addEventListener("click", () => {
      if (!currentPizza) {
        return; // Do nothing if no pizza is selected
      }
  
      const itemName = currentPizza.name;
  
      if (cartItemsMap.hasOwnProperty(itemName)) {
        cartItemsMap[itemName]++; // Increment quantity if the item is already in the cart
      } else {
        cartItemsMap[itemName] = 1; // Initialize quantity to 1 if the item is not in the cart
      }
  
      // Remove existing item from cart
      const existingItem = Array.from(cartList.children).find((item) => item.dataset.name === itemName);
      if (existingItem) {
        existingItem.remove();
      }
  
      // Add updated item to cart
      const newItem = document.createElement("li");
      newItem.textContent = `${cartItemsMap[itemName]} ${itemName}`;
      newItem.dataset.name = itemName;
      cartList.append(newItem);
  
      updateTotal();
    });
  }
  
  

function clearCart() {
    clearCartButton.addEventListener("click", () => {
      cartList.innerHTML = "";

      updateTotal(); //update the total when the cart is cleared
    });
}

function updateTotal() {
    let total = 0;
    Object.entries(cartItemsMap).forEach(([itemName, quantity]) => {
      total += quantity;
    });
  
    const randomTotal = Math.floor(Math.random() * total * 100); // Generate a random number based on the total quantity
    totalElement.textContent = "Total $" + randomTotal;
  }
  
  

placeOrderButton.addEventListener("click", () => {
    // Clear the cart contents
    cartList.innerHTML = "";
    cartItemsMap = {}; // clear the cart iems map

    //display the popup modal
    popupModal.style.display = "block"
    });

  closeModalButton.addEventListener("click", () => {
    //hide the popup modal
    popupModal.style.display = "none";
  });

  window.addEventListener ("click", (event) => {
    if (event.target === popupModal) {
        // Hide the popup modal when you click outside of it
        popupModal.style.display = "none";
    }
    });

    removeButton.addEventListener("click", () => {
      const pizzaName = detailName.textContent;
      const cartItems = Array.from(cartList.children);
      const pizzaToRemove = cartItems.find((item) => item.textContent.includes(pizzaName));
      if (pizzaToRemove) {
        const pizzaCount = pizzaToRemove.textContent.match(/\d+/);
        if (pizzaCount && pizzaCount[0] > 1) {
          pizzaToRemove.textContent = pizzaToRemove.textContent.replace(pizzaCount[0], pizzaCount[0] - 1);
        } else {
          cartList.removeChild(pizzaToRemove);
        }
        updateTotal();
      }
    });
    

// function showMenu() {
//     const pizzaOptionsToggle = document.getElementsByClassName("pizza-list")
//     for (let i = 0; i < pizzaOptions.length; i++) {
//         pizzaOptionsToggle.addEventListener("click", (e) {
//             pizzaOptionsToggle
//         }
//     }
// }