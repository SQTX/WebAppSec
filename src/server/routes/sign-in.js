const mysql = require("mysql2");


function usersSignIn(server, bcrypt, jwt, dbConfig) {
  const connection = mysql.createConnection(dbConfig);

  // Endpoint logowania użytkownika
  server.post("/users/signin", async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
      return res
        .status(400)
        .json({ message: "Login and password are required" });
    }

    try {
      // Znalezienie użytkownika w bazie danych
      const sqlUser = `SELECT * FROM clients WHERE login = ?`;
      connection.query(sqlUser, [login], async (err, results) => {
        if (err) {
          console.error("Błąd zapytania do bazy danych (users):", err.message);
          return res.status(500).json({ message: "Database error" });
        }

        // Sprawdzenie, czy użytkownik istnieje
        if (results.length === 0) {
          return res.status(404).json({ message: "Cannot find user" });
        }

        const user = results[0];

        // Sprawdzenie hasła (porównanie hasha)
        const isPasswordValid = await bcrypt.compare(
          password,
          user.password_hash
        );
        if (!isPasswordValid) {
          return res.status(403).json({ message: "Not allowed" });
        }

        // Pobranie ACCESS_TOKEN_SECRET i REFRESH_TOKEN_SECRET z bazy danych
        const sqlSecrets = `SELECT access_token_secret, refresh_token_secret FROM clients WHERE id = ?`;
        connection.query(sqlSecrets, [user.id], async (err, secretsResults) => {
          if (err) {
            console.error(
              "Błąd zapytania do bazy danych (secrets):",
              err.message
            );
            return res.status(500).json({ message: "Database error" });
          }

          // Sprawdzenie, czy znaleziono sekrety
          if (secretsResults.length === 0) {
            return res
              .status(404)
              .json({ message: "Secrets not found for user" });
          }

          const { access_token_secret, refresh_token_secret } =
            secretsResults[0];

          // Generowanie tokenów
          const accessToken = jwt.sign(
            { id: user.id, login: user.login }, // Dane użytkownika w tokenie
            access_token_secret,
            { expiresIn: "15m" } // Token ważny przez 15 minut
          );

          const refreshToken = jwt.sign(
            { id: user.id, login: user.login }, // Dane użytkownika w tokenie
            refresh_token_secret,
            { expiresIn: "7d" } // Token ważny przez 7 dni
          );

          console.log("Login successful:", login);
          console.log("Generated JWT:", accessToken);
          console.log("Generated refJWT:", refreshToken);

          // Opcjonalne zapisanie refreshToken w bazie danych
          const updateTokenSql = `UPDATE clients SET refJWT_token = ? WHERE id = ?`;
          connection.query(updateTokenSql, [refreshToken, user.id], (err) => {
            if (err) {
              console.error("Błąd podczas zapisywania tokenu:", err.message);
              return res
                .status(500)
                .json({ message: "Failed to save refresh token" });
            }

            // Zwrócenie tokenów do klienta
            res.status(200).json({
              message: "Login successful",
              accessToken,
              refreshToken,
            });
          });
        });
      });
    } catch (error) {
      console.error("Błąd podczas logowania:", error.message);
      res.status(500).json({ message: "Server error during login" });
    }
  });
}

module.exports = usersSignIn;