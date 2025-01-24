const params = new URLSearchParams(window.location.search);
let prodId = params.get("prodId");
const nameProduct = document.getElementById("product-name");
const description = document.getElementById("product-description");

const API_KEY =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzkzNGFkNGI3NDcwMTAwMTU4YjJhYmQiLCJpYXQiOjE3Mzc3MDYxOTYsImV4cCI6MTczODkxNTc5Nn0.V0ml8hcgSI_rL__f3qdAPH9CmSQxi6PYeeoJO3pUY7k";
let myApiUrl = "https://striveschool-api.herokuapp.com/api/product/" + prodId;

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
      nameProduct.classList.add("display-5");
      nameProduct.innerText = product.name;
      document.getElementById("product-description").innerText = product.description;
      document.getElementById("product-brand").innerText = product.brand;
      document.getElementById("product-img").src = product.imageUrl;
      document.getElementById("product-img").classList.add("d-flex", "mx-auto", "img-fluid", "mb-3");
      document.getElementById("product-price").innerText = product.price;

      const divBtn = document.getElementById("btn-edit");
      const btnEdit = document.createElement("a");
      btnEdit.classList.add("btn", "btn-warning");
      btnEdit.text = "Modifica";
      btnEdit.href = "./backoffice.html?prodId=" + product._id;
      divBtn.appendChild(btnEdit);
    })
    .catch((err) => {
      console.dir(err);

      //generateAlert(err.message);
    })
    .finally(() => {});
}
setValuesForm();
