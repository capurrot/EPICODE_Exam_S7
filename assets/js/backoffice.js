const params = new URLSearchParams(window.location.search);
let prodId = params.get("prodId");

const myForm = document.querySelector("form");

const ctrlSx = document.getElementById("sx");
const ctrlDx = document.getElementById("dx");

const btnYesModal = document.getElementById("resetsi");
btnYesModal.addEventListener("click", resetForm);
const btnNoModal = document.getElementById("resetno");
btnNoModal.addEventListener("click", () => {
  bootstrap.Modal.getInstance(document.getElementById("staticBackdrop")).hide();
});

const titleModal = document.getElementById("staticBackdropLabel");
const msgMdal = document.getElementById("nodalmessage");

const titleBack = document.querySelector("h2");

const msgSuccess = document.getElementById("msgsuccess");

const btnSave = document.createElement("button");
btnSave.classList.add("btn", "btn-success");
btnSave.innerText = "Salva";
ctrlSx.appendChild(btnSave);

const btnReset = document.createElement("button");
btnReset.classList.add("btn", "btn-secondary");
btnReset.innerText = "Resetta il form";
btnReset.type = "button";
btnReset.setAttribute("data-bs-toggle", "modal");
btnReset.setAttribute("data-bs-target", "#staticBackdrop");
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
btnDel.setAttribute("data-bs-toggle", "modal");
btnDel.setAttribute("data-bs-target", "#staticBackdrop");
ctrlDx.appendChild(btnDel);

let myMethod = prodId === null ? "POST" : "PUT";
if (!prodId) {
  prodId = "";
  ctrlSx.removeChild(btnEdit);
  ctrlDx.removeChild(btnDel);
} else {
  ctrlSx.removeChild(btnSave);
  ctrlDx.removeChild(btnReset);
  btnDel.addEventListener("click", verifyDelProd);
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
        if (response.status === 400) {
          throw new Error("Dati del prodotto non validi.");
        } else if (response.status === 401) {
          throw new Error("Non autorizzato. Verifica la tua API Key.");
        } else if (response.status === 404) {
          throw new Error("Prodotto non trovato.");
        } else if (response.status === 503) {
          throw new Error("Servizio non disponibile. Riprova più tardi.");
        } else {
          throw new Error(`Errore ${response.status}: ${response.statusText}`);
        }
      }
    })
    .then((createdProd) => {
      console.log("Prodotto creato/modificato con successo:", createdProd);

      //alert(`Prodotto con id ${createdProd._id} creato/modificato correttamente!`);
      msgSuccess.parentElement.classList.remove("d-none");
      msgSuccess.innerText = `Prodotto con id ${createdProd.id} creato/modificato correttamente!`;
      //alert(`Prodotto con id ${createdProd.id} creato/modificato correttamente!`);
      if (myMethod === "POST") myForm.reset();
    })
    .catch((err) => {
      console.error("Errore durante l'operazione:", err);
      alert(`Errore durante l'operazione: ${err.message}`);
    });
}

function deleteProduct() {
  //const hasConfirmed = confirm("sei sicuro di voler eliminare il prodotto?");
  //if (hasConfirmed) {
  fetch(myApiUrl, { method: "DELETE", headers: { Authorization: API_KEY } })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((deletedProduct) => {
      //alert(`Abbiamo eliminato ${deletedProduct.name} con id ${deletedProduct._id}`);

      msgSuccess.parentElement.classList.remove("d-none");
      msgSuccess.innerText = `Abbiamo eliminato ${deletedProduct.name} con id ${deletedProduct.id}`;
      //alert(`Abbiamo eliminato ${deletedProduct.name} con id ${deletedProduct.id}`);

      //Dopo aver dato il messaggio di conferma aspetto 2 secondi prima di passare alla pagina iniziale
      myForm.reset();
      setTimeout(() => {
        window.location.assign("./index.html");
      }, 2000);
    })
    .catch((err) => console.log(err));
  //}
}

function resetForm() {
  myForm.reset();
}

function verifyDelProd() {
  titleModal.innerText = "Conferma eliminazione";
  msgMdal.innerText = "Sei sicuro di voler eliminare il prodotto?";
  btnNoModal.addEventListener("click", () => {
    bootstrap.Modal.getInstance(document.getElementById("staticBackdrop")).hide();
    return;
  });
  btnYesModal.addEventListener("click", deleteProduct);
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
    .finally(() => {});
}
