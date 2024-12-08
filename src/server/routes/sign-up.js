const mysql = require("mysql2");
const crypto = require("crypto");


function usersSignUp(server, bcrypt, dbConfig) {
  const connection = mysql.createConnection(dbConfig); // Connection with DB

  // Endpoint rejestracji użytkownika
  server.post("/users/signup", async (req, res) => {
    try {
      // TODO: Walidacja danych wejściowych (np. za pomocą Joi)

      // Salt, password and tokens:
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const accessTokenSecret = crypto.randomBytes(64).toString("hex");
      const refreshTokenSecret = crypto.randomBytes(64).toString("hex");

      // Create new User Obj.:
      const user = {
        name: req.body.name,
        login: req.body.login,
        email: req.body.email,
        password: hashedPassword,
      };

      // MySQL queries:
      const sqlCreateNewCart = `INSERT INTO carts (session_id) VALUES ('session12345')`;

      const sqlAddUserQuery = `
        INSERT INTO clients (name, login, email, password_hash, access_token_secret, refresh_token_secret, cart_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      // Create new shop cart for new user:
      const [cartResult] = await connection.promise().query(sqlCreateNewCart);
      const cartId = cartResult.insertId;
      console.log(`New shop cart has created, ID: ${cartId}`);

      // Create new client profile:
      connection.query(
        sqlAddUserQuery,
        [
          user.name,
          user.login,
          user.email,
          hashedPassword,
          accessTokenSecret,
          refreshTokenSecret,
          cartId,
        ],
        (err, results) => {
          if (err) {
            console.error("Błąd podczas dodawania użytkownika:", err.message);
            res.status(500).json({ message: "Database error" });
            return;
          }

          console.log("New client has added, ID:", results.insertId);
          res.status(201).json({ message: "Account was created" });
        }
      );
    } catch (error) {
      console.error("Błąd serwera:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  });
}

module.exports = usersSignUp;
