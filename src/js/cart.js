// Funkcja do aktualizacji liczby produktów w koszyku
function loadCartItems() {
  const accessToken = localStorage.getItem("accessToken");

  fetch("/cart/data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      return response.json(); // Parsujemy odpowiedź JSON w przypadku sukcesu
    })
    .then((data) => {
      console.log("Get data about user cart.");
      localStorage.setItem("cartInfo", data);
      window.location.href = "/cart.html";
    });
}

// Wykonaj funkcję po załadowaniu strony
document.addEventListener("DOMContentLoaded", function () {
  const cartBtn = document.getElementById("cartBtn");

  cartBtn.addEventListener("click", loadCartItems);
});
