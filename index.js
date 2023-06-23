// <-- write code here -->
let allPizzas;

const pizzaList = document.getElementById("pizza-list")

fetch("http://localhost:3000/pizzas")
.then(resp => resp.json())
.then(data =>{
    allPizzas = data;
    console.log(allPizzas)
    allPizzas.forEach(pizza => addPizzaToList(pizza))
})

function addPizzaToList(pizza){
    const img = document.createElement("img")
    img.src = pizza.image
    pizzaList.append(img)
}