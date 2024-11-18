const mysql = require("mysql2");

function userLogout(server, jwt, dbConfig) {
  const connection = mysql.createConnection(dbConfig);

  server.post("/users/logout", (req, res) => {
    // Pobieramy accessToken z nagłówka
    const token =
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1]; // Token w formacie "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "Access token is required" });
    }

    // Dekodowanie tokenu, aby uzyskać ID użytkownika
    const userId = getUserIdFromToken(token); // Funkcja do dekodowania tokenu i wyciągania ID

    if (!userId) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Pobranie secret z bazy danych na podstawie id użytkownika
    const getSecretSql = `SELECT access_token_secret FROM clients WHERE id = ?`;
    connection.query(getSecretSql, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching secret from database:", err.message);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const access_token_secret = results[0].access_token_secret;
      console.log("Access token secret for user:", access_token_secret);

      // Weryfikacja tokenu JWT za pomocą secret pobranego z bazy danych
      jwt.verify(token, access_token_secret, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }

        console.log("User ID from token:", decoded.id);

        // Usuwamy refreshToken z bazy danych
        const deleteTokenSql = `UPDATE clients SET refJWT_token = NULL WHERE id = ?`;
        connection.query(deleteTokenSql, [userId], (err, results) => {
          if (err) {
            console.error("Error while removing token:", err.message);
            return res.status(500).json({ message: "Database error" });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
          }

          console.log("Refresh token removed for user ID:", userId);
          res.status(200).json({ message: "Logout successful" });
        });
      });
    });
  });
}

function getUserIdFromToken(token) {
  try {
    // Podziel token na trzy części
    const parts = token.split(".");

    if (parts.length !== 3) {
      throw new Error("Nieprawidłowy token JWT");
    }

    // Zdekoduj drugą część (payload), która jest zakodowana w Base64
    const payloadBase64 = parts[1];

    // Zdekoduj Base64 do formatu JSON
    const decodedPayload = Buffer.from(payloadBase64, "base64").toString(
      "utf8"
    );

    // Parsuj JSON
    const parsedPayload = JSON.parse(decodedPayload);

    // Zakładając, że ID użytkownika jest zapisane w polu 'id'
    if (parsedPayload && parsedPayload.id) {
      return parsedPayload.id;
    } else {
      throw new Error("Nie znaleziono ID użytkownika w tokenie");
    }
  } catch (error) {
    console.error("Błąd dekodowania tokenu JWT:", error.message);
    return null; // Zwróć null, jeśli wystąpi błąd
  }
}

module.exports = userLogout;
