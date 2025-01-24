// Cambio tema della pagina

const palette = document.getElementById("palette");

palette.addEventListener("click", () => {
  const currentTheme = document.body.getAttribute("data-bs-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.body.setAttribute("data-bs-theme", newTheme);
});
