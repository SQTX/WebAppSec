const productBoxes = document.querySelectorAll(".product");
const cartCountElement = document.getElementById("cartNumber");

for (let product of productBoxes) {
  product.addEventListener("click", () => {
    const itemId = product.getAttribute("data-item-id");

    const jwtToken = localStorage.accessToken;

    const payload = {
      item_id: itemId,
    };

    fetch("/cart/additem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        return response.json(); // Parsujemy odpowiedź JSON w przypadku sukcesu
      })
      .then((data) => {
        let itemNumber = Number(cartCountElement.textContent);
        itemNumber += 1;
        cartCountElement.textContent = itemNumber;
        localStorage.setItem("itemsInCart", itemNumber);
        console.log("Liczba produktów w koszyku:", itemNumber);
      });
  });
}
