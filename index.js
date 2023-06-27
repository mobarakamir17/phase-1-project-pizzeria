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
const pizzaAll = document.getElementById("all")
const pizzaClassic = document.getElementById("classic")
const pizzaPopular = document.getElementById("popular")
const pizzaNew = document.getElementById("new")
// New Pizza Form Elements
const createNewPizzaForm = document.getElementById("create-new")
const newName = document.getElementById("new-name")
const newIng1 = document.getElementById("ingredient1")
const newIng2 = document.getElementById("ingredient2")
const newIng3 = document.getElementById("ingredient3")
const newRating = document.getElementById("new-rating")
const newRequest = document.getElementById("new-request")


fetch("http://localhost:3000/pizzas")
.then(resp => resp.json())
.then(data =>{
  data.forEach(pizza => addPizzaToList(pizza))
  currentPizza = data[0];
  // displayPizzaDetails();
  addPizzaToCart();
  clearCart();
  createCustomPizza();
  displayPizzaClassics(data);
  displayPizzaPopulars(data);
  displayPizzaNews(data);
  displayPizzaAll(data);
})

function displayPizzaDetails(){
  currentPizzaImage.src = currentPizza.image;
  detailName.textContent = currentPizza.name;
  (currentPizza.ingredients).forEach((ingredient) => {
    const liElement = document.createElement("li")
    liElement.textContent = ingredient;
    toppingsList.append(liElement);
  })
  shownComment.textContent = currentPizza.comment;
  ratingShown.textContent = currentPizza.rating; 
}

function toggleDetails() {
    var headers = document.querySelectorAll("#myDetails h3");
    headers.forEach(function(header) {
      header.style.display = "block";
    });
  }

function addPizzaToList(pizza){
  const img = document.createElement("img")
  img.src = pizza.image
  pizzaList.append(img)

  const pizzaName = document.createElement("div")
  pizzaName.textContent = pizza.name
  pizzaList.append(pizzaName)
  
  //event listener will show the selected pizza's details in the central detail section of the screen
  img.addEventListener("click", () => {
    toppingsList.innerHTML = "";
    currentPizza = pizza;
    currentPizzaImage.src  = currentPizza.image;
    detailName.textContent = currentPizza.name;
    (currentPizza.ingredients).forEach((ingredient) => {
      const liElement = document.createElement("li")
      liElement.textContent = ingredient;
      toppingsList.append(liElement);
    })
    shownComment.textContent = currentPizza.comment; // display the comment
    ratingShown.textContent = currentPizza.rating; // display the rating
  });

  // If statement to add a delete button if pizza is a custom pizza
  if(pizza.type === "Custom") {
    const removeCustomButton = document.createElement("p")
    removeCustomButton.textContent = "Delete"
    pizzaName.append(removeCustomButton)

    removeCustomButton.addEventListener("click", () => {
      console.log(pizza.id)
      fetch(`http://localhost:3000/pizzas/${pizza.id}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(resp => resp.json())
      .then(() => {
        img.remove();
        pizzaName.remove();
      })
      .catch(err => console.log("Caught Delete" + err))
    })
  }
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
    cartItemsMap = {};
    
    updateTotal(); //update the total when the cart is cleared
  });
}

function updateTotal() {
  let total = 0;
  Object.entries(cartItemsMap).forEach(([itemName, quantity]) => {
    total += quantity;
  });
  
  if (total > 0) {
    const randomTotal = Math.floor(Math.random() * total * 100);
    totalElement.textContent = "Total $" + randomTotal;
  } else {
    totalElement.textContent = "Total $0";
  }
}

function createCustomPizza(){
  createNewPizzaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newPizza = {
      "name": newName.value,
      "type": "Custom",
      "image": "images/custom pizza.png",
      "rating": newRating.value,
      "request": newRequest.value,
      "ingredients": []
    }
      
    if(ingredient1.checked){newPizza.ingredients.push(ingredient1.value)}
    if(ingredient2.checked){newPizza.ingredients.push(ingredient2.value)}
    if(ingredient3.checked){newPizza.ingredients.push(ingredient3.value)}
   
    // let pizzaIngCheese = document.createElement("img")
    
    fetch("http://localhost:3000/pizzas",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify(newPizza)
    })
    .then(resp => resp.json())
    .then(() => {
      addPizzaToList(newPizza);
      currentPizza = newPizza;
      displayPizzaDetails();
      createNewPizzaForm.reset();
    })
    .catch(err => console.log("Caught Post" + err))
  })
}

placeOrderButton.addEventListener("click", () => {
    // Clear the cart contents
    cartList.innerHTML = "";
    cartItemsMap = {}; // clear the cart items map
  
    updateTotal();
    //display the popup modal
    popupModal.style.display = "block";
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
        cartItemsMap[pizzaName]--; // Decrement the quantity in the cartItemsMap
      } else {
        cartList.removeChild(pizzaToRemove);
        delete cartItemsMap[pizzaName]; // Remove the item from the cartItemsMap
      }
      
      updateTotal();
    }
  });
  

function displayPizzaClassics(pizzaData) {
  pizzaClassic.addEventListener("click", () => {
// innerhtml resets instead of adding data
    pizzaList.innerHTML = "";
    pizzaData.forEach(pizza => {
      if(pizza.type === "Classic"){
        addPizzaToList(pizza);
      }
    })
  })
}

function displayPizzaPopulars(pizzaData) {
  pizzaPopular.addEventListener("click", () => {
    pizzaList.innerHTML = "";
    pizzaData.forEach(pizza => {
      if(pizza.type === "Popular"){
        addPizzaToList(pizza);
      }
    })
  })
}

function displayPizzaNews(pizzaData) {
  pizzaNew.addEventListener("click", () => {
    pizzaList.innerHTML = "";
    pizzaData.forEach(pizza => {
      if(pizza.type === "New"){
        addPizzaToList(pizza);
      }
    })
  })
}
    
function displayPizzaAll(pizzaData) {
  pizzaAll.addEventListener("click", () => {
    pizzaList.innerHTML = ""
    pizzaData.forEach(pizza => {
      addPizzaToList(pizza);
    })
  })
};