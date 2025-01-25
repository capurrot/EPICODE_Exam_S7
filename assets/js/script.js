// Cambio tema della pagina

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("palette");

  const myTheme = localStorage.getItem("theme");
  if (myTheme) {
    document.body.setAttribute("data-bs-theme", myTheme);
  } else {
    document.body.setAttribute("data-bs-theme", "light");
  }

  toggleButton.addEventListener("click", function () {
    if (document.body.getAttribute("data-bs-theme") === "light") {
      document.body.setAttribute("data-bs-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.setAttribute("data-bs-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });
});

// Costanti necessarie a tutte le pagine

const API_KEY =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzkzNGFkNGI3NDcwMTAwMTU4YjJhYmQiLCJpYXQiOjE3Mzc3MDYxOTYsImV4cCI6MTczODkxNTc5Nn0.V0ml8hcgSI_rL__f3qdAPH9CmSQxi6PYeeoJO3pUY7k";
let myApiUrl = "https://striveschool-api.herokuapp.com/api/product/";

/* Dato che il server era caduto ho creato delle api per proseguire.
Ho anche impostato dei messaggi di errore che escono con degli alert di Bootstrap
const API_KEY = "";
let myApiUrl = "https://679404b85eae7e5c4d908da3.mockapi.io/api/v1/products/";*/

// Identifico dove sono i puntamenti per i messaggi di successo o errore
const msgSuccess = document.getElementById("msgsuccess");
const msgError = document.getElementById("msgerror");

// Eseguo questo codice solo sulla pagina index
if (window.location.href.match("index.html") != null) {
  fetch(myApiUrl, {
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
    .then((products) => {
      console.log(products);
      // Faccio riferimento ad un elemento del DOM

      const rowProducts = document.getElementById("products");

      // Adesso ciclo il json per mostrare i prodotti disponibili
      products.forEach((product) => {
        //console.log(product);
        // Creo gli elementi della card dei prodotti
        const colCard = document.createElement("div");
        colCard.classList.add("col-12", "col-md-6", "col-lg-4", "col-xl-3");

        const prodCard = document.createElement("div");
        prodCard.classList.add("card", "rounded-0", "mb-4", "overflow-hidden");

        const imgCard = document.createElement("img");
        imgCard.classList.add("car-img-top", "p-4", "mx-auto");
        imgCard.src = "https://i.ebayimg.com/images/g/lsoAAOSw-D1eoBh4/s-l640.jpg";
        //imgCard.src = product.imageUrl;
        imgCard.alt = product.name;

        const prodCardBody = document.createElement("div");
        prodCardBody.classList.add("card-body");

        const h5Card = document.createElement("h5");
        h5Card.classList.add("card-title", "fs-6", "fw-light", "ps-2", "pe-0");
        h5Card.innerText = product.name;

        const pCard = document.createElement("p");
        pCard.classList.add("card-text", "fs-4", "px-2");
        pCard.innerText = product.price + " €";

        const divControls = document.createElement("div");
        divControls.classList.add("d-flex", "justify-content-between", "align-items-center");

        const btnView = document.createElement("a");
        btnView.classList.add("info-link");
        btnView.text = "Dettaglio";
        // commento temporaneamente questo codice per il test da nuovo api rest
        btnEdit.href = "./backoffice.html?prodId=" + product._id;
        //btnView.href = "./detail.html?prodId=" + product.id;

        const btnEdit = document.createElement("a");
        btnEdit.classList.add("btn", "btn-warning");
        btnEdit.text = "Modifica";
        // commento temporaneamente questo codice per il test da nuovo api rest
        btnEdit.href = "./backoffice.html?prodId=" + product._id;
        //btnEdit.href = "./backoffice.html?prodId=" + product.id;

        // Appendo gli elementi al DOM

        prodCardBody.appendChild(h5Card);
        prodCardBody.appendChild(pCard);
        divControls.appendChild(btnView);
        divControls.appendChild(btnEdit);
        prodCardBody.appendChild(divControls);
        prodCard.appendChild(imgCard);
        prodCard.appendChild(prodCardBody);
        colCard.appendChild(prodCard);
        rowProducts.appendChild(colCard);
      });
    })
    .catch((err) => {
      msgError.parentElement.classList.remove("d-none");
      msgError.innerText = `Errore durante l'operazione: ${err.message}`;
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
