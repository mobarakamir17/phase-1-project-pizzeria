# phase-1-project-pizzeria


You are setting up a pizza ordering app that allows hungry customers to conveniently order both standard and custom pizzas! YUM!

## Demo

[file:///Users/courtneymcclain/Downloads/Home.pdf]

## Setup

Run `json-server --watch db.json` to get started. 
Open the `index.html` file on your browser to run the application

## Deliverables

As the user, I can:

1. For each pizza displayed on [http://localhost:3000/characters/pizzas](http://localhost:3000/pizzas), create an image. You will need to make a GET request to retrive pizza data.

2. As soon as the page loads, we should see images and names of our pizza choices.

3. When you click on each pizza image in the left nav, the detail area becomes populated with the name, ingredients, comments, and rating. For the custom pizza, your should see the optional toppings and be able to click to add or remove ingredients.

4. When you click on the 'add to cart' button, the pizza should appear listed in the 'cart' menu.

5. Once your pizza's are added to your cart, your total should show up on the bottom of the page. If you click on 'Place Order', a notification appears the your order has been placed.

Example:

If you buy 3 pizzas, the accumulative amount should be displayed at the bottom.