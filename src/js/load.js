// Funkcja do aktualizacji liczby produktów w koszyku
function updateCartCount() {
  const cartCountElement = document.getElementById("cartNumber");

  // Odczytaj liczbę produktów z localStorage
  const itemsInCart = localStorage.getItem("itemsInCart");
  console.log("Liczba jaka powinna być przy koszyku:", itemsInCart);
  // Zaktualizuj tekst w elemencie DOM
  if (itemsInCart) {
    cartCountElement.textContent = itemsInCart;
  } else {
    cartCountElement.textContent = "0"; // Domyślnie 0, jeśli brak danych
  }
}

// Wykonaj funkcję po załadowaniu strony
document.addEventListener("DOMContentLoaded", updateCartCount);
