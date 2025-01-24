// Imposto le costanti necessarie per il fetch comprese di parametri per edit e delete
const params = new URLSearchParams(window.location.search);
let prodId = params.get("prodId");
const myForm = document.querySelector("form");
const ctrlSx = document.getElementById("sx");
const ctrlDx = document.getElementById("dx");

const btnSave = document.createElement("button");
btnSave.classList.add("btn", "btn-success");
btnSave.innerText = "Salva";
ctrlSx.appendChild(btnSave);

const btnReset = document.createElement("button");
btnReset.classList.add("btn", "btn-secondary");
btnReset.innerText = "Resetta il form";
btnReset.type = "button";
ctrlDx.appendChild(btnReset);

const btnEdit = document.createElement("button");
btnEdit.classList.add("btn", "btn-warning");
btnEdit.innerText = "Salva la modifica";
btnEdit.type = "button";
ctrlSx.appendChild(btnEdit);

const btnDel = document.createElement("button");
btnDel.classList.add("btn", "btn-danger");
btnDel.innerText = "Elimina";
btnDel.type = "button";
ctrlDx.appendChild(btnDel);

let myMethod = prodId === null ? "POST" : "PUT";
if (!prodId) {
  prodId = "";
  ctrlSx.removeChild(btnEdit);
  ctrlDx.removeChild(btnDel);
} else {
  ctrlSx.removeChild(btnSave);
  ctrlDx.removeChild(btnReset);
  btnDel.addEventListener("click", deleteProduct);
  btnEdit.addEventListener("click", handleProduct);
}

const URL = "https://striveschool-api.herokuapp.com/api/product/" + prodId;
const API_KEY =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzkzNGFkNGI3NDcwMTAwMTU4YjJhYmQiLCJpYXQiOjE3Mzc3MDYxOTYsImV4cCI6MTczODkxNTc5Nn0.V0ml8hcgSI_rL__f3qdAPH9CmSQxi6PYeeoJO3pUY7k";

console.log(URL);
class ProductObj {
  constructor(name, description, brand, imageUrl, price) {
    this.name = name;
    this.description = description;
    this.brand = brand;
    this.imageUrl = imageUrl;
    this.price = price;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  myForm.addEventListener("submit", function (e) {
    e.preventDefault();
    handleProduct();
  });
});

function handleProduct() {
  if (myForm.elements.brand.value === "Seleziona un elemento dalla lista") {
    alert("Seleziona un Brand dalla lista o aggiungine uno");
    return;
  }

  const myProduct = new ProductObj(
    myForm.elements.name.value,
    myForm.elements.description.value,
    myForm.elements.brand.value,
    myForm.elements.imageurl.value,
    myForm.elements.price.value
  );

  fetch(URL, {
    method: myMethod,
    body: JSON.stringify(myProduct),
    headers: {
      "Content-Type": "application/json",
      Authorization: API_KEY,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nella creazione del prodotto");
      }
    })
    .then((createdProd) => {
      alert(`Prodotto con id ${createdProd._id} creato/modificato correttamente!`);
      if (myMethod === "POST") myForm.reset();
    })
    .catch((err) => console.log(err));
}

function deleteProduct() {
  const hasConfirmed = confirm("sei sicuro di voler eliminare il prodotto?");
  if (hasConfirmed) {
    fetch(URL, { method: "DELETE", headers: { Authorization: API_KEY } })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((deletedProduct) => {
        alert(`Abbiamo eliminato ${deletedProduct.name} con id ${deletedProduct._id}`);
        window.location.assign("./index.html");
      })
      .catch((err) => console.log(err));
  }
}

const palette = document.getElementById("palette");
palette.addEventListener("click", () => {
  const newTheme = document.body.getAttribute("data-bs-theme") === "light" ? "dark" : "light";
  document.body.setAttribute("data-bs-theme", newTheme);
});
