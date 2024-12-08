// const mysql = require("mysql2");
const authenticationToken = require("./../main");

function getNumberOfProducts(server, mysql, dbConfig) {
  const connection = mysql.createConnection(dbConfig);

  server.get("/cart/numberof", authenticationToken, async (req, res) => {
    try {
      const clientID = req.user.id;
      const sqlItemInCart = `SELECT COUNT(cart_id) AS NumberOfProducts FROM cart_products WHERE cart_id=?`;

      const [cartResult] = await connection
        .promise()
        .query(sqlItemInCart, [clientID]);
      const numberOfProducts = cartResult[0].NumberOfProducts;
      console.log(numberOfProducts);

      res.status(201).json({ NumberOfProducts: numberOfProducts });
    } catch (error) {
      console.error("Błąd serwera:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  });
}

function addItemToCart(server, mysql, dbConfig) {
  const connection = mysql.createConnection(dbConfig);

  server.post("/cart/additem", authenticationToken, async (req, res) => {
    try {
      console.log(req);

      const clientID = req.user.id;
      const itemID = req.body.item_id;
      const quantity = 1;
      // console.log("Client:", clientID);
      // console.log("Item:", itemID);
      // console.log("Q:", quantity);

      const sqlAddItem = `
      INSERT INTO cart_products (cart_id, product_id, quantity)
      VALUES (?, ?, ?)`;

      await connection
        .promise()
        .query(sqlAddItem, [clientID, itemID, quantity]);

      console.log(
        `User [${clientID}] has added [${quantity}] new items [${itemID}] to his/her cart`
      );

      res.status(201).json({ Message: "Add new item to cart" });
    } catch (error) {
      console.error("Błąd serwera:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  });
}

function getCartData(server, mysql, dbConfig) {
  const connection = mysql.createConnection(dbConfig);

  server.get("/cart/data", authenticationToken, async (req, res) => {
    try {
      const clientID = req.user.id;
      console.log("clientID", clientID);
      const sqlGetCartIdByClientId = `SELECT cart_id FROM clients WHERE client_id=?`;
      const [clientResult] = await connection
        .promise()
        .query(sqlGetCartIdByClientId, [clientID]);

      const cartID = clientResult[0].cart_id;
      console.log("cartID", cartID);
      const sqlGetItemIds = `SELECT product_id FROM cart_products WHERE cart_id=?`;
      const [cartResult] = await connection
        .promise()
        .query(sqlGetItemIds, [cartID]);

      let itemsInCart = [];
      for (let item of cartResult) {
        const itemId = item.product_id;
        console.log("itemId", itemId);
        const sqlGetItemById = `SELECT name, description, price FROM products WHERE id=?`;
        const [itemResult] = await connection
          .promise()
          .query(sqlGetItemById, [itemId]);
        console.log(itemResult);
        itemsInCart.push(itemResult[0]);
      }
      console.log(itemsInCart);

      const jsonString = JSON.stringify(itemsInCart, null, 2);
      console.log(jsonString);

      res.status(201).json(jsonString);
    } catch (error) {
      console.error("Błąd serwera:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  });
}

module.exports = { getNumberOfProducts, addItemToCart, getCartData };
