// Cambio tema della pagina

const palette = document.getElementById("palette");

palette.addEventListener("click", () => {
  const currentTheme = document.body.getAttribute("data-bs-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.body.setAttribute("data-bs-theme", newTheme);
});

// Costanti necessarie a tutte le pagine

const API_KEY =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzkzNGFkNGI3NDcwMTAwMTU4YjJhYmQiLCJpYXQiOjE3Mzc3MDYxOTYsImV4cCI6MTczODkxNTc5Nn0.V0ml8hcgSI_rL__f3qdAPH9CmSQxi6PYeeoJO3pUY7k";
let myApiUrl = "https://striveschool-api.herokuapp.com/api/product/";

document.addEventListener("DOMContentLoaded", () => {
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
        imgCard.src = product.imageUrl;
        imgCard.alt = product.name;

        const prodCardBody = document.createElement("div");
        prodCardBody.classList.add("card-body");

        const h5Card = document.createElement("h5");
        h5Card.classList.add("card-title", "fs-6", "fw-light", "ps-2", "pe-0");
        h5Card.innerText = product.name;

        const pCard = document.createElement("p");
        pCard.classList.add("card-text", "fs-4", "px-2");
        pCard.innerText = product.price;

        const divControls = document.createElement("div");
        divControls.classList.add("d-flex", "justify-content-between", "align-items-center");

        const btnView = document.createElement("a");
        btnView.classList.add("info-link");
        btnView.text = "Dettaglio";
        btnView.href = "./detail.html?prodId=" + product._id;

        const btnEdit = document.createElement("a");
        btnEdit.classList.add("btn", "btn-warning");
        btnEdit.text = "Modifica";
        btnEdit.href = "./backoffice.html?prodId=" + product._id;

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
});
