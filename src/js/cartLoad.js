function loadCart() {
  const cartInfo = JSON.parse(localStorage.getItem("cartInfo"));
  const cartContainer = document.getElementById("cartContainer");

  const SHIP_PRICE = 9.99;
  let fullPrice = 0.0;

  for (let item of cartInfo) {
    const prod_name = item.name;
    const prod_desc = item.description;
    const prod_price = item.price;
    // console.log(`Product data: ${prod_name} ${prod_desc} ${prod_price}`);
    fullPrice += Number(prod_price);

    const newRow = generateProductRow(prod_name, prod_desc, prod_price);
    cartContainer.appendChild(newRow);

    updatePrice(fullPrice, SHIP_PRICE);
  }

  // Dodajemy nowy wiersz do tabeli o id "productTable"
}

function generateProductRow(prod_name, prod_desc, prod_price) {
  // Tworzymy element <tr>
  const row = document.createElement("tr");

  // Tworzymy pierwszą komórkę <th> z nazwą i opisem produktu
  const th = document.createElement("th");
  th.scope = "row";
  th.innerHTML = `
    <div class="d-flex align-items-center">
      <img
        src="./assets/img/no-photo.jpg"
        class="img-fluid rounded-3"
        style="width: 120px"
        alt="Product"
      />
      <div class="flex-column ms-4">
        <p class="mb-2">${prod_name}</p>
        <p class="mb-0">${prod_desc}</p>
      </div>
    </div>
  `;

  // Dodajemy <th> do <tr>
  row.appendChild(th);

  // Tworzymy drugą komórkę <td> z przyciskami + i - oraz polem liczby
  const tdQuantity = document.createElement("td");
  tdQuantity.classList.add("align-middle");
  tdQuantity.innerHTML = `
    <div class="d-flex flex-row">
      <button
        data-mdb-button-init
        data-mdb-ripple-init
        class="btn btn-link px-2"
        onclick="this.parentNode.querySelector('input[type=number]').stepDown()"
      >
        <i class="fas fa-minus"></i>
      </button>

      <input
        id="form1"
        min="0"
        name="quantity"
        value="1"
        type="number"
        class="form-control form-control-sm"
        style="width: 50px"
      />

      <button
        data-mdb-button-init
        data-mdb-ripple-init
        class="btn btn-link px-2"
        onclick="this.parentNode.querySelector('input[type=number]').stepUp()"
      >
        <i class="fas fa-plus"></i>
      </button>
    </div>
  `;

  // Dodajemy <td> z ilością do <tr>
  row.appendChild(tdQuantity);

  // Tworzymy trzecią komórkę <td> z ceną
  const tdPrice = document.createElement("td");
  tdPrice.classList.add("align-middle");
  tdPrice.innerHTML = `
    <p class="mb-0" style="font-weight: 500">
      <span class="prod-price">${prod_price}</span>
      PLN
    </p>
  `;

  // Dodajemy <td> z ceną do <tr>
  row.appendChild(tdPrice);

  // Zwracamy wygenerowany wiersz <tr>
  return row;
}

function updatePrice(fullPrice, shipPrice) {
  const sumPriceSpan = document.getElementById("sumPrice");
  const shipPriceSpan = document.getElementById("shipPrice");
  const totalPriceSpan = document.getElementById("totalPrice");

  sumPriceSpan.innerText = fullPrice;
  shipPriceSpan.innerText = shipPrice;
  let total = Number(fullPrice) + Number(shipPrice);
  totalPriceSpan.innerText = Math.round(total * 100) / 100;
}

// Wykonaj funkcję po załadowaniu strony
document.addEventListener("DOMContentLoaded", loadCart);
