const params = new URLSearchParams(window.location.search);
let prodId = params.get("prodId");
const nameProduct = document.getElementById("product-name");
const description = document.getElementById("product-description");
const brand = document.getElementById("product-brand");
const price = document.getElementById("product-price");

function setValuesForm() {
  fetch(myApiUrl + prodId, {
    headers: {
      Authorization: API_KEY,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        if (response.status === 400) {
          throw new Error("400: Dati del prodotto non validi.");
        } else if (response.status === 401) {
          throw new Error("401: Non autorizzato. Verifica la tua API Key.");
        } else if (response.status === 404) {
          throw new Error("404: Prodotto non trovato.");
        } else if (response.status === 503) {
          throw new Error("503: Servizio non disponibile. Riprova più tardi.");
        } else if (response.status === 500) {
          throw new Error("500: Errore interno del server");
        } else {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
      }
    })
    .then((product) => {
      document.getElementById("product-img").classList.add("d-flex", "mx-auto", "img-fluid", "my-3");
      document.getElementById("product-img").src = product.imageUrl;
      nameProduct.classList.add("display-5");
      nameProduct.innerText = product.name;
      description.innerText = product.description;
      brand.innerText = product.brand;
      price.innerText = product.price + " €";

      const divBtn = document.getElementById("btn-edit");
      const btnEdit = document.createElement("a");
      btnEdit.classList.add("btn", "btn-warning");
      btnEdit.text = "Modifica";
      // commento temporaneamente questo codice per il test da nuovo api rest
      //btnEdit.href = "./backoffice.html?prodId=" + product._id;
      btnEdit.href = "./backoffice.html?prodId=" + product.id;
      divBtn.appendChild(btnEdit);
    })
    .catch((err) => {
      msgError.parentElement.classList.remove("d-none");
      msgError.innerText = `Errore durante l'operazione: ${err.message}`;
    });
}
setValuesForm();
