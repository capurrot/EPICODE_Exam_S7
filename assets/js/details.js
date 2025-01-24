const params = new URLSearchParams(window.location.search);
let prodId = params.get("prodId");
const nameProduct = document.getElementById("product-name");
const description = document.getElementById("product-description");

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
      // commento temporaneamente questo codice per il test da nuovo api rest
      //btnEdit.href = "./backoffice.html?prodId=" + product._id;
      btnEdit.href = "./backoffice.html?prodId=" + product.id;
      divBtn.appendChild(btnEdit);
    })
    .catch((err) => {
      console.dir(err);

      //generateAlert(err.message);
    })
    .finally(() => {});
}
setValuesForm();
