// Imposto le costanti necessarie per il fetch comprese di parametri per edit e delete
const params = new URLSearchParams(window.location.search);
let prodId = params.get("prodId");
const myForm = document.querySelector("form");
const ctrlSx = document.getElementById("sx");
const ctrlDx = document.getElementById("dx");
const titleBack = document.querySelector("h2");

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
  btnReset.addEventListener("click", resetForm);
} else {
  ctrlSx.removeChild(btnSave);
  ctrlDx.removeChild(btnReset);
  btnDel.addEventListener("click", deleteProduct);
  btnEdit.addEventListener("click", handleProduct);
  titleBack.innerText = "Backoffice - Gestione di un prodotto";
  myApiUrl += prodId;
  setValuesForm();
}

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

  fetch(myApiUrl, {
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
    fetch(myApiUrl, { method: "DELETE", headers: { Authorization: API_KEY } })
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

function resetForm() {
  myForm.reset();
}

function setValuesForm() {
  fetch(myApiUrl, {
    headers: {
      Authorization: API_KEY,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nel fetch dei prodotti");
      }
    })
    .then((product) => {
      console.log(product);
      myForm.elements.name.value = product.name;
      myForm.elements.description.value = product.description;
      myForm.elements.brand.value = product.brand;
      myForm.elements.imageurl.value = product.imageUrl;
      myForm.elements.price.value = product.price;
    })
    .catch((err) => {
      console.dir(err);

      generateAlert(err.message);
    })
    .finally(() => {
      isLoading(false);
    });

  const isLoading = function (loadingState) {
    const spinner = document.querySelector(".spinner-border");

    if (loadingState) {
      spinner.classList.remove("d-none");
    } else {
      spinner.classList.add("d-none");
    }
  };
}
