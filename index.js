// <-- write code here -->
let currentPizza;
let cartItemsMap = {}; // Map to track the quantity of each item in the cart
let currentRunningTotal = 0; // Use to display total $ amount on screen?  Still working on this, see updateTotal function
let selectedRating = 0; // Variable to store the selected rating

// Left hand side list of pizza pictures
const pizzaList = document.getElementById("pizza-list");
const customPizzaImage = document.getElementById("custom-pizza-button")
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
const placeOrderButton = document.getElementById("place-order")
const cartItems = document.getElementById("cart-area").querySelector("ul");
const totalElement = document.getElementById("total");
// Modal elements
const popupModal = document.getElementById("popup-modal");
const closeModalButton = document.querySelector(".close")
const ratingContainer = document.getElementById("rating-container");
const ratingStars = document.querySelectorAll(".rating-star");
const submitRatingButton = document.getElementById("submit-rating-button");
// Filter elements
const pizzaAll = document.getElementById("all")
const pizzaClassic = document.getElementById("classic")
const pizzaPopular = document.getElementById("popular")
const pizzaNew = document.getElementById("new")
const allFilterButtons = document.getElementsByClassName("nav-link")
// New Pizza Form Elements
const createNewPizzaForm = document.getElementById("create-new")
const newName = document.getElementById("new-name")
const newIng1 = document.getElementById("ingredient1")
const newIng2 = document.getElementById("pepperoni")
const newIng3 = document.getElementById("ingredient3")
const newIng4 = document.getElementById("ingredient4")
const newIng5 = document.getElementById("ingredient5")
const newIng6 = document.getElementById("ingredient6")
const newIng7 = document.getElementById("ingredient7")
const newIng8 = document.getElementById("ingredient8")
const newIng9 = document.getElementById("ingredient9")
const newRating = document.getElementById("new-rating")
const newRequest = document.getElementById("new-request")
const customPizzaBase = document.getElementById("pic-detail-area")
//^ want this to append to top of detail area so we can see custom creation

const testGetToppingList = document.querySelectorAll(".toppingsIng")
const testToppingList = Array.from(testGetToppingList)
// console.log(testToppingList)
// testToppingList.forEach(topping => console.log(topping.value))

fetch("http://localhost:3000/pizzas")
.then(resp => resp.json())
.then(data =>{
  data.forEach(pizza => addPizzaToList(pizza))
  currentPizza = data[0];
  // displayPizzaDetails();
  addPizzaToCart();
  clearCart();
  createCustomPizza();
  displayPizzaToppings()
  displayPizzaFilter(data);
  changeFilterColors();
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


function addPizzaToList(pizza){
    const pizzaName = document.createElement("div")
    const img = document.createElement("img")
    img.src = pizza.image
    img.id = "pizza-image";
    
    pizzaName.textContent = pizza.name
    
    pizzaName.insertBefore(img, pizzaName.firstChild)
  
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
      const headers = document.getElementById("hideable-area");
      headers.style.display = "block";
      createNewPizzaForm.style.display = "none"
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
    updateTotal("add");
  });
}


function clearCart() {
  clearCartButton.addEventListener("click", () => {
    cartList.innerHTML = "";
    cartItemsMap = {};
    
    updateTotal(); //update the total when the cart is cleared
  });
}


function updateTotal(addOrSub) {
  // The addOrSub parameter is only passed if you want the action to add ("add" parameter) to the total of subtract ("sub" parameter) from it.  If you want to clear the total, leave blank.
  let totalItems = 0;
  Object.entries(cartItemsMap).forEach(([itemName, quantity]) => {
    totalItems += quantity;
  });
  const randomNumber = Math.floor(Math.random() * totalItems * 100); // Generates a random number for the below if stament to use.  Currently the numbers max size is based on how many items are in the cart(ie. totalItems in this function)
  if (totalItems > 0 && addOrSub === "add") {
    currentRunningTotal += randomNumber;
    totalElement.textContent = "Total $" + currentRunningTotal;
  } else if(totalItems > 0 && addOrSub === "sub"){
    currentRunningTotal -= randomNumber;
    currentRunningTotal = Math.max(currentRunningTotal, 10); // Insures the number can not be negative.  Currently set to not go below 10
    totalElement.textContent = "Total $" + currentRunningTotal;
  } else {
    totalElement.textContent = "Total $0";
    currentRunningTotal = 0;
  }
}




function createCustomPizza(){
  customPizzaImage.addEventListener("click", () => {
    createNewPizzaForm.style.display = "block"
    
    // Reset the pizza details
    const headers = document.getElementById("hideable-area");
    headers.style.display = "none";
    createNewPizzaForm.style.display = "visible"
  });
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
    if(ingredient4.checked){newPizza.ingredients.push(ingredient4.value)}
    if(ingredient5.checked){newPizza.ingredients.push(ingredient5.value)}
    if(ingredient6.checked){newPizza.ingredients.push(ingredient6.value)}
    if(ingredient7.checked){newPizza.ingredients.push(ingredient7.value)}
    if(ingredient8.checked){newPizza.ingredients.push(ingredient8.value)}
    if(ingredient9.checked){newPizza.ingredients.push(ingredient9.value)}

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
  });
}


// Function to hide headers until an image is clicked
function toggleDetails() {
  const headers = document.getElementById("hideable-area");

  currentPizzaImage.addEventListener("click", function () {
    headers.style.display = "block";
  });
}
// Add an event listener to the image
// currentPizzaImage.addEventListener("click", function() {
//   // Toggle the display property of the headers
//   headers.forEach(function(header) {
//     if (header.style.display === "none") {
//       header.style.display = "block";
//     } else {
//       header.style.display = "none";
//     }
//   });
// });

ratingContainer.addEventListener("mouseover", (event) => {
    if (event.target.classList.contains("rating-star")) {
      const starIndex = Array.from(ratingStars).indexOf(event.target) + 1;
      highlightStars(starIndex);
    }
  });
  
  ratingContainer.addEventListener("mouseout", () => {
    highlightStars(selectedRating);
  });
  
  ratingContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("rating-star")) {
      const starIndex = Array.from(ratingStars).indexOf(event.target) + 1;
      selectedRating = starIndex;
      highlightStars(starIndex);
    }
  });
  
  submitRatingButton.addEventListener("click", () => {
    // Process the selected rating
    console.log("Selected Rating:", selectedRating);
  
    // Clear the rating
    selectedRating = 0;
  
    // Refresh the page
    location.reload();
  });
  
  function highlightStars(starIndex) {
    ratingStars.forEach((star, index) => {
      if (index < starIndex) {
        star.classList.add("filled");
      } else {
        star.classList.remove("filled");
      }
    });
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
    updateTotal("sub");
  }
});
  

function displayPizzaToppings() {
  // show topping pic when checkbox clicked
  let toppingPicPepp = document.createElement('img')
  toppingPicPepp.src = "/images/pepperoni top.PNG"
  newIng2.addEventListener("click", (e) => {
    if (newIng2.checked) {
      customPizzaBase.append(toppingPicPepp)
    } else {
        toppingPicPepp.remove()
    }
  })
}





// const testGetToppingList = document.querySelectorAll(".toppingsIng")
// const testToppingList = Array.from(testGetToppingList)
// console.log(testToppingList)
// testToppingList.forEach(topping => console.log(topping.value))





function displayPizzaFilter(pizzaData) {
  pizzaClassic.addEventListener("click", () => {
    // innerhtml resets instead of adding data
    pizzaList.innerHTML = "";
    pizzaData.forEach(pizza => {
      if(pizza.type === "Classic"){
        addPizzaToList(pizza);
      }
    })
  })
  pizzaPopular.addEventListener("click", () => {
    pizzaList.innerHTML = "";
    pizzaData.forEach(pizza => {
      if(pizza.type === "Popular"){
        addPizzaToList(pizza);
      }
    })
  })
  pizzaNew.addEventListener("click", () => {
    pizzaList.innerHTML = "";
    pizzaData.forEach(pizza => {
      if(pizza.type === "New"){
        addPizzaToList(pizza);
      }
    })
  })
  pizzaAll.addEventListener("click", () => {
    pizzaList.innerHTML = ""
    pizzaData.forEach(pizza => {
      addPizzaToList(pizza);
    })
  })
}


function changeFilterColors() {
  pizzaAll.addEventListener("mouseenter", () => {
    pizzaAll.style.color = "red";
  })
  pizzaAll.addEventListener("mouseout", ()=> {
    pizzaAll.style.color = "white";
  })
  pizzaClassic.addEventListener("mouseenter", () => {
    pizzaClassic.style.color = "red";
  })
  pizzaClassic.addEventListener("mouseout", ()=> {
    pizzaClassic.style.color = "white";
  })
  pizzaPopular.addEventListener("mouseenter", () => {
    pizzaPopular.style.color = "red";
  })
  pizzaPopular.addEventListener("mouseout", ()=> {
    pizzaPopular.style.color = "white";
  })
  pizzaNew.addEventListener("mouseenter", () => {
    pizzaNew.style.color = "red";
  })
  pizzaNew.addEventListener("mouseout", ()=> {
    pizzaNew.style.color = "white";
  })
}