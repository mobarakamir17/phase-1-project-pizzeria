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
const newComment = document.getElementById("new-comment");
const ratingShown = document.getElementById("rating-shown")
const addToCartButton = document.getElementById("add-to-cart")
const removeButton = document.getElementById("remove");
const headers = document.getElementById("hideable-area");
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
const pizzaCustomCreation = document.getElementById("custom-made")
const allFilterButtons = document.getElementsByClassName("nav-link")
const filterButtonsArray = Array.from(allFilterButtons)
// New Pizza Form Elements
const createNewPizzaForm = document.getElementById("create-new")
const newName = document.getElementById("new-name")
const newRating = document.getElementById("new-rating")
const newRequest = document.getElementById("new-request")
// Used to hide and display the toppings
const testGetToppingCheckboxs = document.querySelectorAll(".toppingsIng")
const testToppingList = Array.from(testGetToppingCheckboxs)
const testGetToppingImgs = document.querySelectorAll(".top-toppings")
const toppingImgs = Array.from(testGetToppingImgs) 


fetch("http://localhost:3000/pizzas")
.then(resp => resp.json())
.then(data =>{
  data.forEach(pizza => addPizzaToList(pizza))
  addPizzaToCart();
  clearCart();
  createCustomPizza();
  displayPizzaToppings();
  displayPizzaFilter(data);
  changeFilterColors();
})


function displayPizzaDetails() {
  currentPizzaImage.src = currentPizza.image; // Set the image source to the current pizza's image
  detailName.textContent = currentPizza.name; // Set the detail name to the current pizza's name
  toppingsList.innerHTML = ""; 
  currentPizza.ingredients.forEach(ingredient => {
    const liElement = document.createElement("li"); 
    liElement.textContent = ingredient; 
    toppingsList.appendChild(liElement); 
  });
  shownComment.textContent = currentPizza.comment // Set the shown comment to the current pizza's comment
  ratingShown.textContent = currentPizza.rating; // Set the rating shown to the current pizza's rating
}
  

function addPizzaToList(pizza) {
  const pizzaName = document.createElement("div"); // Create a new div element for the pizza name
  const img = document.createElement("img"); 
  img.src = pizza.image; 
  img.id = "pizza-image"; // Set the ID of the image
  pizzaName.textContent = pizza.name; // Set the text content of the pizza name to the pizza's name
  pizzaName.insertBefore(img, pizzaName.firstChild); // Insert the image as the first child of the pizza name
  pizzaName.classList.add("white-text"); // Add the "white-text" class to the pizza name
  pizzaList.append(pizzaName); 
    
  //event listener will show the selected pizza's details in the central detail section of the screen
  img.addEventListener("click", () => {
    toppingsList.innerHTML = "";
    currentPizza = pizza; // Set the current pizza to the selected pizza
    currentPizzaImage.src = currentPizza.image; // Set the current pizza image source
    detailName.textContent = currentPizza.name; // Set the detail name to the current pizza's name

    currentPizza.ingredients.forEach((ingredient) => {
      const liElement = document.createElement("li"); // Create a new list item element
      liElement.textContent = ingredient; // Set the text content of the list item to the current ingredient
      toppingsList.append(liElement); 
    });
    shownComment.textContent = currentPizza.comment; // display the comment
    ratingShown.textContent = currentPizza.rating; // display the rating
    headers.style.display = "block";
    createNewPizzaForm.style.display = "none";
  });

  // If-statement to add a delete button if pizza is a custom pizza
  if(pizza.type === "Custom") {
    const removeCustomButton = document.createElement("p")
    removeCustomButton.className = 'delete-button-cust'
    removeCustomButton.textContent = "DELETE"
    pizzaName.append(removeCustomButton)
  
    removeCustomButton.addEventListener("click", () => {
      // Send a DELETE request to the server to delete the pizza with the specified ID
      fetch(`http://localhost:3000/pizzas/${pizza.id}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(resp => resp.json()) // Parse the response as JSON
      .then(() => {
        img.remove(); 
        pizzaName.remove(); 
      })
      .catch(err => console.log("Caught Delete" + err)); // Handle any errors that occur during the delete request
    })
  }
};


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
    newItem.classList.add("cart-item"); // Add the cart-item class
    cartList.append(newItem);
    updateTotal("add");
  });
}
  


function clearCart() {
  clearCartButton.addEventListener("click", () => {
    cartList.innerHTML = ""; // Clear the contents of the cart list by setting its HTML to an empty string
    cartItemsMap = {}; // Reset the cartItemsMap to an empty object, effectively clearing the cart items
    
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
    currentRunningTotal += randomNumber; // Increase the current running total by the generated random number
    totalElement.textContent = "Total $" + currentRunningTotal; // Update the totalElement with the updated running total value
  } else if (totalItems > 0 && addOrSub === "sub") {
    currentRunningTotal -= randomNumber; // Decrease the current running total by the generated random number
    currentRunningTotal = Math.max(currentRunningTotal, 10); // Ensure that the number cannot be negative. The current running total is capped at a minimum value of 10.
    totalElement.textContent = "Total $" + currentRunningTotal; // Update the totalElement with the updated running total value
  } else {
    totalElement.textContent = "Total $0"; // If there are no items in the cart, set the totalElement to display "$0"
    currentRunningTotal = 0; // Reset the current running total to 0
  }
}


function createCustomPizza() {
  customPizzaImage.addEventListener("click", () => {
    createNewPizzaForm.style.display = "block";
    // Hide pizza details and show the create custom pizza form
    headers.style.display = "none";
    createNewPizzaForm.style.display = "visible";
  });
  createNewPizzaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newPizza = {
      "name": newName.value,
      "type": "Custom",
      "image": "https://res.cloudinary.com/practicaldev/image/fetch/s--MugTjLP8--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_800/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7rbgc67we2nblq3od5ih.png",
      "comment": newRequest.value,
      "rating": "5 ★",
      "ingredients": []
    };
    // Add selected ingredients to the pizza
    if (ingredient1.checked) { newPizza.ingredients.push(ingredient1.value) }
    if (ingredient2.checked) { newPizza.ingredients.push(ingredient2.value) }
    if (ingredient3.checked) { newPizza.ingredients.push(ingredient3.value) }
    if (ingredient4.checked) { newPizza.ingredients.push(ingredient4.value) }
    if (ingredient5.checked) { newPizza.ingredients.push(ingredient5.value) }
    if (ingredient6.checked) { newPizza.ingredients.push(ingredient6.value) }
    if (ingredient7.checked) { newPizza.ingredients.push(ingredient7.value) }
    if (ingredient8.checked) { newPizza.ingredients.push(ingredient8.value) }
    if (ingredient9.checked) { newPizza.ingredients.push(ingredient9.value) }
  
    fetch("http://localhost:3000/pizzas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPizza)
    })
    .then(resp => resp.json())
    .then(() => {
      toppingsList.innerHTML = "";
      addPizzaToList(newPizza);
      currentPizza = newPizza;
      createNewPizzaForm.reset();
      headers.style.display = "block";
      createNewPizzaForm.style.display = "none";
      toppingImgs.forEach(topping => topping.style.display = "none");
      displayPizzaDetails();
      shownComment.textContent = `Request: ${newPizza.comment}`; // Set the request comment
    })
    .catch(err => console.log("Caught Post" + err))
  });
}


// Function to hide headers until an image is clicked
function toggleDetails() {  
  currentPizzaImage.addEventListener("click", function () {
    headers.style.display = "block";
  });
}

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
  console.log("Selected Rating:", selectedRating);  // Process the selected rating
  selectedRating = 0;  // Clear the rating
  location.reload();  // Refresh the page
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
  cartList.innerHTML = ""; // Clear the cart contents
  cartItemsMap = {}; // clear the cart items map
  updateTotal();
  popupModal.style.display = "block"; //display the popup modal
});


closeModalButton.addEventListener("click", () => {
  popupModal.style.display = "none"; // Hide the popup modal
});


window.addEventListener ("click", (event) => {
  if (event.target === popupModal) {
    popupModal.style.display = "none";  // Hide the popup modal when you click outside of it
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
  toppingImgs.forEach(img => img.style.display = "none")  //  Hide all toppings
  testToppingList.forEach(topping => {
    topping.addEventListener("click", () => {
      let nextSibiling = topping.nextElementSibling; //  Get the img following the checkbox
      if (topping.checked) {
        nextSibiling.style.display = "initial"
      } else {
        nextSibiling.style.display = "none"
      }
    })
  })
}


function displayPizzaFilter(pizzaData) {
  pizzaClassic.addEventListener("click", () => {
    pizzaList.innerHTML = "";  // innerhtml resets instead of continuing adding data to list
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
  pizzaCustomCreation.addEventListener("click", () => {
    pizzaList.innerHTML = "";
    pizzaData.forEach(pizza => {
      if(pizza.type === "Custom"){
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
  filterButtonsArray.forEach(filterButton => {
    filterButton.addEventListener("mouseenter", () => {
      filterButton.style.color = "red";
    })
    filterButton.addEventListener("mouseout", ()=> {
      filterButton.style.color = "white";
    })
  })
}